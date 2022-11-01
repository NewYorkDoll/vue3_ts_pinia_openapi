/* eslint-disable no-unused-vars */
import { Method } from "axios";
import { paths, components } from "../types/petstore";

type urls = keyof paths;

/**
 * 接口定义的数据模型
 */
export type D = components["schemas"];

export type Paths = paths;
/**
 * 后端对象统一包装
 */
export type Res<T = any> = D["PayReturnResultModelMessageModel"] & { data: T };

/**
 * 分页响应
 */
export type PageRes<T = any> = D["PayReturnResultModelMessageModel"] & { list: T[] };

/**
 * 后端统一包装的分页响应
 * @example ResList<{name: string}>
 */
export type ResList<T = any> = D["SysUserInfoDtoPageModel"];

/**
 * 根据 http method 获取对应的urlkey
 */
export type PathKeyOfMethod<R extends Method> = {
  [Key in keyof paths]: paths[Key] extends {
    // eslint-disable-next-line no-unused-vars
    [k in R]: any;
  }
    ? Key
    : never;
}[keyof paths];

export type PathKeyUnion =
  | PathKeyOfMethod<"get">
  | PathKeyOfMethod<"post">
  | PathKeyOfMethod<"put">
  | PathKeyOfMethod<"delete">
  | PathKeyOfMethod<"patch">
  | PathKeyOfMethod<"head">
  | PathKeyOfMethod<"options">;

/**
 * 从urlkey 中选定一个url
 */
export type PathKey<T extends Method, R extends PathKeyOfMethod<T>> = Extract<
  PathKeyOfMethod<T>,
  R
>;

type A<T extends PathKeyUnion> = Paths[T];

export type Get<T extends PathKeyUnion> = Extract<keyof A<T>, "get">;
export type Post<T extends PathKeyUnion> = Extract<keyof A<T>, "post">;
export type Put<T extends PathKeyUnion> = Extract<keyof A<T>, "put">;
export type Patch<T extends PathKeyUnion> = Extract<keyof A<T>, "patch">;
export type Delete<T extends PathKeyUnion> = Extract<keyof A<T>, "delete">;
export type Head<T extends PathKeyUnion> = Extract<keyof A<T>, "head">;
export type Options<T extends PathKeyUnion> = Extract<keyof A<T>, "options">;

// 根据 method 获取url
type ExtractMethod<
  T extends Method,
  R extends PathKeyOfMethod<T>
> = A<R>[Extract<keyof A<R>, T>];

/**
 *
 */
type ExtractMethodParam<
  T extends Method,
  R extends PathKeyOfMethod<T>
> = ExtractMethod<T, R>[Extract<keyof ExtractMethod<T, R>, "parameters">];

/**
 * 根据 url 和 http method 提取request path 传参
 */
export type ExtractParamPath<
  T extends Method,
  R extends PathKeyOfMethod<T>
> = ExtractMethodParam<T, R>[Extract<keyof ExtractMethodParam<T, R>, "path">];

/**
 * 根据 url 和 http method 提取request query 传参
 * 目前有个问题，apifox 在导出param query 或 param path 对象时会丢失类型，全部变成了string，暂时手动处理吧
 */
export type ExtractParamQuery<
  T extends Method,
  R extends PathKeyOfMethod<T>
> = ExtractMethodParam<T, R>[Extract<keyof ExtractMethodParam<T, R>, "query">];

// ------------------- JSON Obj
export type ExtractMethodRequestBody<
  T extends Method,
  R extends PathKeyOfMethod<T>
> = ExtractMethod<T, R>[Extract<keyof ExtractMethod<T, R>, "requestBody">];

export type ExtractMethodRequestBodyContent<
  T extends Method,
  R extends PathKeyOfMethod<T>
> = ExtractMethodRequestBody<T, R>[Extract<
  keyof ExtractMethodRequestBody<T, R>,
  "content"
>];

type ExtractMethodRequestBodyContentJSON<
  T extends Method,
  R extends PathKeyOfMethod<T>
> = ExtractMethodRequestBodyContent<T, R>[Extract<
  keyof ExtractMethodRequestBodyContent<T, R>,
  "application/json"
>];

/**
 * 根据http method 和 url 提取requestBody json
 */
export type ExtractRequestBodyJSON<
  T extends Exclude<Method, "get" | "head" | "options" | "delete">,
  R extends PathKeyOfMethod<T>
> = ExtractMethodRequestBodyContentJSON<T, R>;

type ExtractMethodResponse<
  T extends Method,
  R extends PathKeyOfMethod<T>
> = ExtractMethod<T, R>[Extract<keyof ExtractMethod<T, R>, "responses">];

type ExtractMethodResponse200<
  T extends Method,
  R extends PathKeyOfMethod<T>
> = ExtractMethodResponse<T, R>[Extract<
  keyof ExtractMethodResponse<T, R>,
  200
>];

type ExtractMethodResponse200Content<
  T extends Method,
  R extends PathKeyOfMethod<T>
> = ExtractMethodResponse200<T, R>[Extract<
  keyof ExtractMethodResponse200<T, R>,
  "content"
>];

type ExtractMethodResponse200ContentJSON<
  T extends Method,
  R extends PathKeyOfMethod<T>
> = ExtractMethodResponse200Content<T, R>[Extract<
  keyof ExtractMethodResponse200Content<T, R>,
  "application/json"
>];

/**
 * 根据 http method 和 url 提取200响应JSON数据
 */
export type Extract200JSON<
  T extends Method,
  R extends PathKeyOfMethod<T>
> = ExtractMethodResponse200ContentJSON<T, R>;
