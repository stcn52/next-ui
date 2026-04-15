import{n as e}from"./chunk-zsgVPwQN.js";import{t}from"./react-C184PLS3.js";import{n,r,t as i}from"./jsx-runtime-BAjPxNjI.js";import{n as a,t as o}from"./dist-BdRtY-9f.js";import{i as s,p as c,t as l}from"./lucide-react-BaPjlpEq.js";function u({className:e,variant:t,...r}){return(0,m.jsx)(`div`,{"data-slot":`alert`,role:`alert`,className:n(h({variant:t}),e),...r})}function d({className:e,...t}){return(0,m.jsx)(`div`,{"data-slot":`alert-title`,className:n(`font-heading font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground`,e),...t})}function f({className:e,...t}){return(0,m.jsx)(`div`,{"data-slot":`alert-description`,className:n(`text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4`,e),...t})}function p({className:e,...t}){return(0,m.jsx)(`div`,{"data-slot":`alert-action`,className:n(`absolute top-2 right-2`,e),...t})}var m,h,g=e((()=>{t(),a(),r(),m=i(),h=o(`group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4`,{variants:{variant:{default:`bg-card text-card-foreground`,destructive:`bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current`}},defaultVariants:{variant:`default`}}),u.__docgenInfo={description:``,methods:[],displayName:`Alert`},d.__docgenInfo={description:``,methods:[],displayName:`AlertTitle`},f.__docgenInfo={description:``,methods:[],displayName:`AlertDescription`},p.__docgenInfo={description:``,methods:[],displayName:`AlertAction`}})),_,v,y,b,x,S;e((()=>{g(),l(),_=i(),v={title:`UI/Alert`,component:u,tags:[`autodocs`],argTypes:{variant:{control:`select`,options:[`default`,`destructive`]}}},y={render:()=>(0,_.jsxs)(u,{children:[(0,_.jsx)(c,{}),(0,_.jsx)(d,{children:`Heads up!`}),(0,_.jsx)(f,{children:`You can add components to your app using the CLI.`})]})},b={render:()=>(0,_.jsxs)(u,{variant:`destructive`,children:[(0,_.jsx)(s,{}),(0,_.jsx)(d,{children:`Error`}),(0,_.jsx)(f,{children:`Your session has expired. Please log in again.`})]})},x={render:()=>(0,_.jsxs)(u,{children:[(0,_.jsx)(d,{children:`Note`}),(0,_.jsx)(f,{children:`A simple alert without an icon.`})]})},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <Alert>
      <Info />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <Alert variant="destructive">
      <AlertTriangle />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <Alert>
      <AlertTitle>Note</AlertTitle>
      <AlertDescription>
        A simple alert without an icon.
      </AlertDescription>
    </Alert>
}`,...x.parameters?.docs?.source}}},S=[`Default`,`Destructive`,`NoIcon`]}))();export{y as Default,b as Destructive,x as NoIcon,S as __namedExportsOrder,v as default};