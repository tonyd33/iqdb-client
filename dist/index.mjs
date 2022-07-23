import { load } from 'cheerio';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { Readable } from 'stream';

var IQDBLibs_2D;

(function (IQDBLibs_2D) {
  IQDBLibs_2D[IQDBLibs_2D["danbooru"] = 1] = "danbooru";
  IQDBLibs_2D[IQDBLibs_2D["konachan"] = 2] = "konachan";
  IQDBLibs_2D[IQDBLibs_2D["yande.re"] = 3] = "yande.re";
  IQDBLibs_2D[IQDBLibs_2D["gelbooru"] = 4] = "gelbooru";
  IQDBLibs_2D[IQDBLibs_2D["sankaku channel"] = 5] = "sankaku channel";
  IQDBLibs_2D[IQDBLibs_2D["e-shuushuu"] = 6] = "e-shuushuu";
  IQDBLibs_2D[IQDBLibs_2D["zerochan"] = 11] = "zerochan";
  IQDBLibs_2D[IQDBLibs_2D["anime-picture"] = 13] = "anime-picture";
})(IQDBLibs_2D || (IQDBLibs_2D = {}));

var IQDBLibs_3D;

(function (IQDBLibs_3D) {
  IQDBLibs_3D[IQDBLibs_3D["3dbooru"] = 7] = "3dbooru";
  IQDBLibs_3D[IQDBLibs_3D["idol"] = 9] = "idol";
})(IQDBLibs_3D || (IQDBLibs_3D = {}));

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  return _extends.apply(this, arguments);
}

function parseSimilarity(txt) {
  const result = txt.match(/(-?\d+\.?\d*)(%?)/);

  if (result) {
    return result[2] == undefined || result[2] == '' ? parseFloat(result[1]) : parseFloat(result[1]) / 100;
  } else {
    return null; //couldn't parse similarity
  }
}
function parseSizeAndType(txt) {
  const result = txt.match(/(\d+)×(\d+)(?: \[([A-z]*)\])?/);

  if (result) {
    return {
      size: {
        width: parseInt(result[1]),
        height: parseInt(result[2])
      },
      type: result[3]
    };
  } else {
    return txt;
  }
}
const baseArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "_"];
function randomFileName() {
  const length = 5 + (Math.random() * 10 | 0);
  const baseArrayLength = baseArray.length;
  let str = '';

  for (let i = 0; i < length; i++) {
    str += baseArray[Math.random() * baseArrayLength | 0];
  }

  return str + '.jpg';
}

const defaultConfig = {
  baseDomain: 'iqdb.org',
  simlarityPass: 0.6,
  userAgent: 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'
};

const _addToForm = (form, array) => array.forEach(lib => {
  form.append('service[]', lib);
});
/**
 *
 * @param body 服务器返回的body
 * @param noSource 指示结果中是否应该有source字段
 * @returns
 */


function parseResult(body, similarityPass, noSource) {
  const $ = load(body);
  let ok = false;
  const err = $('.err');

  if (err.length > 0) {
    return {
      ok: false,
      err: err.text()
    };
  }

  const service = $('input[type=checkbox][name="service[]"][checked]').toArray().map(element => {
    const value = parseInt(element.attribs.value);
    const name = IQDBLibs_2D[value] || IQDBLibs_3D[value];
    if (!name) console.warn('Unknown lib: ' + value);
    return value;
  });
  const data = $('#pages').children('div').toArray().map(page => {
    const rows = $(page).find('tr');
    const head = $(rows[0]).text();

    if (head == 'Your image') {
      const sizeAndType = parseSizeAndType($(rows[3]).text());
      return _extends({
        head,
        img: $(rows[1]).find('img').attr('src'),
        name: $(rows[2]).text(),
        // no similarity for your own image
        similarity: null
      }, typeof sizeAndType == 'object' ? sizeAndType : {
        sizeAndType
      });
    } else if (head == 'No relevant matches') {
      return;
    } else {
      let similarity, sizeAndType, source;

      if (noSource) {
        similarity = parseSimilarity($(rows[3]).text());
        sizeAndType = parseSizeAndType($(rows[2]).text());
      } else {
        similarity = parseSimilarity($(rows[4]).text());
        sizeAndType = parseSizeAndType($(rows[3]).text());
        source = $(rows[2]).text().split(' ');
      }

      if (similarity >= similarityPass) ok = true;
      const imgBox = $(rows[1]).find('a');
      return _extends({
        head,
        sourceUrl: imgBox.attr('href'),
        similarity,
        img: imgBox.find('img').attr('src')
      }, typeof sizeAndType == 'object' ? sizeAndType : {
        sizeAndType
      }, {
        source
      });
    }
  }).filter(item => item != undefined);
  return {
    ok,
    data,
    service
  };
}
function makeSearchFunc(config) {
  return async function searchPic(pic, {
    lib,
    forcegray,
    service: libs,
    fileName
  }) {
    const isMultiLib = lib == 'www' || lib == '3d';
    const form = new FormData();

    if (typeof pic == 'string') {
      form.append('url', pic);
    } else if (pic instanceof Buffer || pic instanceof Readable) {
      form.append('file', pic, {
        filename: fileName ? fileName : randomFileName()
      });
    } else {
      throw new TypeError('expect string | Buffer | Readable');
    }

    if (isMultiLib && libs) _addToForm(form, libs);
    if (forcegray) form.append('forcegray', 'true');
    const resp = await fetch(`https://${lib}.${config.baseDomain}`, _extends({
      method: 'POST',
      body: form,
      headers: _extends({}, form.getHeaders(), {
        'User-Agent': config.userAgent
      })
    }, config.fetchOptions));

    if (resp.ok) {
      return parseResult(await resp.text(), config.simlarityPass, !isMultiLib);
    } else {
      return {
        ok: false,
        err: 'HTTP ' + resp.status
      };
    }
  };
}
const searchPic = makeSearchFunc(defaultConfig);

export { IQDBLibs_2D, IQDBLibs_3D, defaultConfig, makeSearchFunc, searchPic };
//# sourceMappingURL=index.mjs.map
