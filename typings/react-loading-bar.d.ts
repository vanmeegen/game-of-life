/// <reference types="react"/>
//
declare interface LoadingProps {
  show: boolean;
  color: string;
  change?: boolean;
}

declare class LoadingBar extends React.Component<LoadingProps, any> {

}

declare module "react-loading-bar" {
  export default LoadingBar;
}
