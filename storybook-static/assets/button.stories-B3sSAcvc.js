import{n as e}from"./chunk-zsgVPwQN.js";import{a as t}from"./utils-cUModyxV.js";import{a as n,h as r,l as i,t as a}from"./lucide-react-BFQVNN2r.js";import{n as o,t as s}from"./button-Du_8gkil.js";var c,l,u,d,f,p,m,h,g,_,v;e((()=>{o(),a(),c=t(),{expect:l,userEvent:u,within:d}=__STORYBOOK_MODULE_TEST__,f={title:`UI/Button`,component:s,tags:[`autodocs`],argTypes:{variant:{control:`select`,options:[`default`,`outline`,`secondary`,`ghost`,`destructive`,`link`]},size:{control:`select`,options:[`default`,`xs`,`sm`,`lg`,`icon`,`icon-xs`,`icon-sm`,`icon-lg`]}}},p={args:{children:`Button`},play:async({canvasElement:e})=>{let t=d(e).getByRole(`button`,{name:/button/i});await l(t).toBeInTheDocument(),await l(t).toBeEnabled(),await u.click(t)}},m={render:()=>(0,c.jsxs)(`div`,{className:`flex flex-wrap gap-2 items-center`,children:[(0,c.jsx)(s,{variant:`default`,children:`Default`}),(0,c.jsx)(s,{variant:`outline`,children:`Outline`}),(0,c.jsx)(s,{variant:`secondary`,children:`Secondary`}),(0,c.jsx)(s,{variant:`ghost`,children:`Ghost`}),(0,c.jsx)(s,{variant:`destructive`,children:`Destructive`}),(0,c.jsx)(s,{variant:`link`,children:`Link`})]})},h={render:()=>(0,c.jsxs)(`div`,{className:`flex flex-wrap gap-2 items-center`,children:[(0,c.jsx)(s,{size:`xs`,children:`Extra Small`}),(0,c.jsx)(s,{size:`sm`,children:`Small`}),(0,c.jsx)(s,{size:`default`,children:`Default`}),(0,c.jsx)(s,{size:`lg`,children:`Large`})]})},g={render:()=>(0,c.jsxs)(`div`,{className:`flex flex-wrap gap-2 items-center`,children:[(0,c.jsxs)(s,{children:[(0,c.jsx)(i,{}),` Add Item`]}),(0,c.jsxs)(s,{variant:`outline`,children:[(0,c.jsx)(r,{}),` Download`]}),(0,c.jsxs)(s,{variant:`destructive`,children:[(0,c.jsx)(n,{}),` Delete`]}),(0,c.jsx)(s,{size:`icon`,children:(0,c.jsx)(i,{})})]})},_={args:{children:`Disabled`,disabled:!0},play:async({canvasElement:e})=>{await l(d(e).getByRole(`button`,{name:/disabled/i})).toBeDisabled()}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Button"
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", {
      name: /button/i
    });
    await expect(button).toBeInTheDocument();
    await expect(button).toBeEnabled();
    await userEvent.click(button);
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2 items-center">
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2 items-center">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2 items-center">
      <Button><Plus /> Add Item</Button>
      <Button variant="outline"><Download /> Download</Button>
      <Button variant="destructive"><Trash2 /> Delete</Button>
      <Button size="icon"><Plus /></Button>
    </div>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Disabled",
    disabled: true
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", {
      name: /disabled/i
    });
    await expect(button).toBeDisabled();
  }
}`,..._.parameters?.docs?.source}}},v=[`Default`,`AllVariants`,`AllSizes`,`WithIcon`,`Disabled`]}))();export{h as AllSizes,m as AllVariants,p as Default,_ as Disabled,g as WithIcon,v as __namedExportsOrder,f as default};