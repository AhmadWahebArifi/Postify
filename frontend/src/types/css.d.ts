declare module '*.css' {
  const content: { [key: string]: string };
  export default content;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.jsx' {
  const Component: any;
  export default Component;
}

declare module '*.jsx?raw' {
  const content: string;
  export default content;
}
