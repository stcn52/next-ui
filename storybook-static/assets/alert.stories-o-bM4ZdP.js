import{n as e}from"./chunk-zsgVPwQN.js";import{t}from"./react-C184PLS3.js";import{a as n,n as r,t as i}from"./utils-cUModyxV.js";import{i as a,p as o,t as s}from"./lucide-react-BFQVNN2r.js";import{n as c,t as l}from"./dist-CiIiThWj.js";function u({className:e,variant:t,...n}){return(0,m.jsx)(`div`,{"data-slot":`alert`,role:`alert`,className:i(h({variant:t}),e),...n})}function d({className:e,...t}){return(0,m.jsx)(`div`,{"data-slot":`alert-title`,className:i(`font-heading font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground`,e),...t})}function f({className:e,...t}){return(0,m.jsx)(`div`,{"data-slot":`alert-description`,className:i(`text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4`,e),...t})}function p({className:e,...t}){return(0,m.jsx)(`div`,{"data-slot":`alert-action`,className:i(`absolute top-2 right-2`,e),...t})}var m,h,g=e((()=>{t(),c(),r(),m=n(),h=l(`group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4`,{variants:{variant:{default:`bg-card text-card-foreground`,destructive:`bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current`}},defaultVariants:{variant:`default`}}),u.__docgenInfo={description:``,methods:[],displayName:`Alert`},d.__docgenInfo={description:``,methods:[],displayName:`AlertTitle`},f.__docgenInfo={description:``,methods:[],displayName:`AlertDescription`},p.__docgenInfo={description:``,methods:[],displayName:`AlertAction`}})),_,v,y,b,x,S,C,w;e((()=>{g(),s(),_=n(),{expect:v,within:y}=__STORYBOOK_MODULE_TEST__,b={title:`UI/Alert`,component:u,tags:[`autodocs`],argTypes:{variant:{control:`select`,options:[`default`,`destructive`]}}},x={render:()=>(0,_.jsxs)(u,{children:[(0,_.jsx)(o,{}),(0,_.jsx)(d,{children:`Heads up!`}),(0,_.jsx)(f,{children:`You can add components to your app using the CLI.`})]}),play:async({canvasElement:e})=>{let t=y(e);await v(t.getByRole(`alert`)).toBeInTheDocument(),await v(t.getByText(`Heads up!`)).toBeVisible()}},S={render:()=>(0,_.jsxs)(u,{variant:`destructive`,children:[(0,_.jsx)(a,{}),(0,_.jsx)(d,{children:`Error`}),(0,_.jsx)(f,{children:`Your session has expired. Please log in again.`})]})},C={render:()=>(0,_.jsxs)(u,{children:[(0,_.jsx)(d,{children:`Note`}),(0,_.jsx)(f,{children:`A simple alert without an icon.`})]})},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <Alert>
      <Info />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByRole("alert");
    await expect(alert).toBeInTheDocument();
    await expect(canvas.getByText("Heads up!")).toBeVisible();
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <Alert variant="destructive">
      <AlertTriangle />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <Alert>
      <AlertTitle>Note</AlertTitle>
      <AlertDescription>
        A simple alert without an icon.
      </AlertDescription>
    </Alert>
}`,...C.parameters?.docs?.source}}},w=[`Default`,`Destructive`,`NoIcon`]}))();export{x as Default,S as Destructive,C as NoIcon,w as __namedExportsOrder,b as default};