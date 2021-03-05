export default interface DecodedToken {
  sub: string;
  exp: number;
  type: string;
  csrf?: string;
  fresh: boolean;
  iat: number;
  jti?: string
}

