/// <reference types="node" />
import { IQDB_SEARCH_OPTIONS_ALL, IQDBClientConfig, IQDBLibs_2D, IQDBLibs_3D, IQDB_RESULT_TYPE } from "./h";
import { Readable } from 'stream';
export interface Size {
    width: number;
    height: number;
}
export declare type IQDBSearchResultItem = {
    head: string;
    img: string;
    name?: string;
    sourceUrl?: string;
    source?: string[];
    similarity: number | null;
} & ({
    size?: Size;
    type?: IQDB_RESULT_TYPE;
} | {
    sizeAndType: string;
});
export declare type SearchPicResult = SearchPicResultWithError | {
    /**是否找到满足相似度的结果 */
    ok: boolean;
    /**返回数据 */
    data: IQDBSearchResultItem[];
    /**在哪些库做了搜索 */
    service: Array<IQDBLibs_2D | IQDBLibs_3D>;
};
export interface SearchPicResultWithError {
    /**是否找到满足相似度的结果 */
    ok: false;
    /**是否发生错误 */
    err?: string;
    data?: IQDBSearchResultItem[];
}
export declare const defaultConfig: IQDBClientConfig;
/**
 *
 * @param body 服务器返回的body
 * @param noSource 指示结果中是否应该有source字段
 * @returns
 */
export declare function parseResult(body: string, similarityPass: number, noSource?: boolean): SearchPicResultWithError | {
    ok: boolean;
    data: IQDBSearchResultItem[];
    service: number[];
};
export declare function makeSearchFunc(config: IQDBClientConfig): (pic: string | Buffer | Readable, { lib, forcegray, service: libs, fileName }: IQDB_SEARCH_OPTIONS_ALL) => Promise<SearchPicResult>;
declare const searchPic: (pic: string | Buffer | Readable, { lib, forcegray, service: libs, fileName }: IQDB_SEARCH_OPTIONS_ALL) => Promise<SearchPicResult>;
export default searchPic;
