import{n as e}from"./chunk-zsgVPwQN.js";import{a as t}from"./utils-cUModyxV.js";import{n,t as r}from"./badge-BLgptYpa.js";var i,a,o,s,c,l,u;e((()=>{n(),i=t(),{expect:a,within:o}=__STORYBOOK_MODULE_TEST__,s={title:`UI/Badge`,component:r,tags:[`autodocs`],argTypes:{variant:{control:`select`,options:[`default`,`secondary`,`destructive`,`outline`,`ghost`,`link`]}}},c={args:{children:`Badge`},play:async({canvasElement:e})=>{let t=o(e);await a(t.getByText(`Badge`)).toBeInTheDocument(),await a(t.getByText(`Badge`)).toBeVisible()}},l={render:()=>(0,i.jsxs)(`div`,{className:`flex flex-wrap gap-2 items-center`,children:[(0,i.jsx)(r,{variant:`default`,children:`Default`}),(0,i.jsx)(r,{variant:`secondary`,children:`Secondary`}),(0,i.jsx)(r,{variant:`destructive`,children:`Destructive`}),(0,i.jsx)(r,{variant:`outline`,children:`Outline`}),(0,i.jsx)(r,{variant:`ghost`,children:`Ghost`})]})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Badge"
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Badge")).toBeInTheDocument();
    await expect(canvas.getByText("Badge")).toBeVisible();
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2 items-center">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
}`,...l.parameters?.docs?.source}}},u=[`Default`,`AllVariants`]}))();export{l as AllVariants,c as Default,u as __namedExportsOrder,s as default};