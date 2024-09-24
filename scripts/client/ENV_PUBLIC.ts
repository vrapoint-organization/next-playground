
/* DO NOT EDIT! THIS IS AUTO-GENERATED FILE */

export default class ENV_PUBLIC {
  ////////////////////////////////////////////////////////////////////////
  // ENV Area
  static DST_ENV =
    (process.env.NEXT_PUBLIC_ENVIRONMENT ?? 
			process.env.NEXT_PUBLIC_VERCEL_ENV ?? 
			process.env.NODE_ENV) as string;
  static IS_DEV = (["development","dev","d"].includes(
					ENV_PUBLIC.DST_ENV?.toLowerCase())) as boolean;
  static IS_QA = (["preview","test","qa"].includes(
					ENV_PUBLIC.DST_ENV?.toLowerCase())) as boolean;
  static IS_PROD = (["prod","production","p"].includes(
					ENV_PUBLIC.DST_ENV?.toLowerCase())) as boolean;

  static IS_DEV_OR_QA = ENV_PUBLIC.IS_DEV || ENV_PUBLIC.IS_QA as boolean;
  ////////////////////////////////////////////////////////////////////////
  // Common Area
  
	static NEXT_PUBLIC_ENVIRONMENT = 
						(process.env.NEXT_PUBLIC_ENVIRONMENT_OVERRIDE ??
						process.env.NEXT_PUBLIC_ENVIRONMENT) as string;
		
	static NEXT_PUBLIC_USER_ACCESS = 
						(process.env.NEXT_PUBLIC_USER_ACCESS_OVERRIDE ??
						process.env.NEXT_PUBLIC_USER_ACCESS) as string;
		
	static NEXT_PUBLIC_USER_REFRESH = 
						(process.env.NEXT_PUBLIC_USER_REFRESH_OVERRIDE ??
						process.env.NEXT_PUBLIC_USER_REFRESH) as string;
  ////////////////////////////////////////////////////////////////////////
  // Forked Area
  static NEXT_PUBLIC_WEBSOCKET_URL =
    (process.env.NEXT_PUBLIC_WEBSOCKET_URL_OVERRIDE ?? (
      (ENV_PUBLIC.IS_DEV ) ? process.env.NEXT_PUBLIC_WEBSOCKET_URL_DEV :
      (ENV_PUBLIC.IS_QA  ) ? process.env.NEXT_PUBLIC_WEBSOCKET_URL_QA :
      (ENV_PUBLIC.IS_PROD) ? process.env.NEXT_PUBLIC_WEBSOCKET_URL_PROD :
      (process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? null)
    )) as string;

  ////////////////////////////////////////////////////////////////////////
  // Init Area
  static is_ENV_PUBLIC_init = false;
  static init_ENV_PUBLIC = () => {
    
    
      if (ENV_PUBLIC.is_ENV_PUBLIC_init) {
        return;
      }
      if (!(ENV_PUBLIC.IS_DEV || ENV_PUBLIC.IS_PROD || ENV_PUBLIC.IS_QA)) {
        throw new Error("Invalid NODE_ENV: " + ENV_PUBLIC.DST_ENV);
      }
    
      const variables = {
        IS_DEV: ENV_PUBLIC.IS_DEV,
        IS_PROD: ENV_PUBLIC.IS_PROD,
        IS_QA: ENV_PUBLIC.IS_QA,
        IS_DEV_OR_QA: ENV_PUBLIC.IS_DEV_OR_QA,
        NEXT_PUBLIC_ENVIRONMENT : ENV_PUBLIC.NEXT_PUBLIC_ENVIRONMENT,
				NEXT_PUBLIC_USER_ACCESS : ENV_PUBLIC.NEXT_PUBLIC_USER_ACCESS,
				NEXT_PUBLIC_USER_REFRESH : ENV_PUBLIC.NEXT_PUBLIC_USER_REFRESH,
				NEXT_PUBLIC_WEBSOCKET_URL : ENV_PUBLIC.NEXT_PUBLIC_WEBSOCKET_URL
      };
      const isNullish = (val: string) =>
        val === undefined ||
        val === null ||
        val?.length === 0;
    
      const missing = Object.keys(variables).filter((key) => isNullish(variables[key])).filter((key) => !key.toLowerCase().startsWith("nullable_"));
    
      if (missing.length > 0) {
        throw new Error(".env.local에 환경변수를 추가해주세요 : " + missing.join(", "));
      }
      ENV_PUBLIC.is_ENV_PUBLIC_init = true;
  
  }

  ////////////////////////////////////////////////////////////////////////
  // toObject Area
  static toObject(): { [key: string]: any } {
    const obj: { [key: string]: any } = {};
    
    Object.getOwnPropertyNames(this).forEach((key) => {
      const value = this[key as keyof typeof ENV_PUBLIC];
      if (typeof value === "string") {
        obj[key] = value;
      }
    });
    
    return obj;
  }
}
ENV_PUBLIC.init_ENV_PUBLIC();
