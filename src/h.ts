export interface IQDBClientConfig {
    baseDomain: string,
    simlarityPass: number
    userAgent: string,
    fetchOptions?: import('node-fetch').RequestInit
}
/**'www'search all libs */
export type IQDB_SEARCH_LIBRARY_2D = 'danbooru' | 'konachan' | 'yandere' | 'gelbooru' | 'sankaku' | 'e-shuushuu' | 'zerochan' | 'anime-pictures' | 'www'
/**cosplay, asian models, idols.'3d' search all libs.*/
export type IQDB_SEARCH_LIBRARY_3D = '3d' | '3dbooru' | 'idol'
export interface IQDB_SEARCH_OPTIONS_GENERAL {
    forcegray?: boolean
    fileName?: string
}
export type IQDB_SEARCH_OPTIONS_2D = ({
    lib: Exclude<IQDB_SEARCH_LIBRARY_2D, 'www'>,
    service?: undefined
} | {
    lib: 'www',
    service?: Array<IQDBLibs_2D>
}) & IQDB_SEARCH_OPTIONS_GENERAL
export type IQDB_SEARCH_OPTIONS_3D = ({
    lib: Exclude<IQDB_SEARCH_LIBRARY_3D, '3d'>,
    service?: undefined
} | {
    lib: '3d',
    service?: Array<IQDBLibs_3D>
}) & IQDB_SEARCH_OPTIONS_GENERAL
export type IQDB_SEARCH_OPTIONS_ALL = IQDB_SEARCH_OPTIONS_2D | IQDB_SEARCH_OPTIONS_3D

export enum IQDBLibs_2D {
    danbooru = 1,
    konachan = 2,
    'yande.re' = 3,
    gelbooru = 4,
    'sankaku channel' = 5,
    'e-shuushuu' = 6,
    zerochan = 11,
    'anime-picture' = 13
}
export enum IQDBLibs_3D {
    '3dbooru' = 7,
    'idol' = 9
}
export type IQDB_RESULT_TYPE = 'Safe' | 'Ero' | 'Explicit' | string