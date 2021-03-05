import { RouteProps } from 'react-router-dom'

export default interface ProtectedRouteProps extends RouteProps {
  redirect?: string;
}
