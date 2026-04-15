import{n as e}from"./chunk-zsgVPwQN.js";import{a as t}from"./utils-cUModyxV.js";import{n,t as r}from"./label-CxgXa4VD.js";import{n as i,t as a}from"./input-HeFw5pcv.js";var o,s,c,l,u,d,f,p,m,h,g;e((()=>{i(),n(),o=t(),{expect:s,userEvent:c,within:l}=__STORYBOOK_MODULE_TEST__,u={title:`UI/Input`,component:a,tags:[`autodocs`]},d={args:{placeholder:`Enter text...`},play:async({canvasElement:e})=>{let t=l(e).getByPlaceholderText(`Enter text...`);await c.click(t),await c.type(t,`Hello Storybook`),await s(t).toHaveValue(`Hello Storybook`)}},f={render:()=>(0,o.jsxs)(`div`,{className:`flex flex-col gap-1.5 w-64`,children:[(0,o.jsx)(r,{htmlFor:`email`,children:`Email`}),(0,o.jsx)(a,{id:`email`,type:`email`,placeholder:`you@example.com`})]})},p={args:{placeholder:`Disabled input`,disabled:!0},play:async({canvasElement:e})=>{await s(l(e).getByPlaceholderText(`Disabled input`)).toBeDisabled()}},m={args:{placeholder:`Invalid input`,"aria-invalid":!0}},h={render:()=>(0,o.jsxs)(`div`,{className:`flex flex-col gap-3 w-64`,children:[(0,o.jsx)(a,{type:`text`,placeholder:`Text`}),(0,o.jsx)(a,{type:`email`,placeholder:`Email`}),(0,o.jsx)(a,{type:`password`,placeholder:`Password`}),(0,o.jsx)(a,{type:`number`,placeholder:`Number`}),(0,o.jsx)(a,{type:`search`,placeholder:`Search...`})]})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Enter text..."
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Enter text...");
    await userEvent.click(input);
    await userEvent.type(input, "Hello Storybook");
    await expect(input).toHaveValue("Hello Storybook");
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-1.5 w-64">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Disabled input",
    disabled: true
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Disabled input");
    await expect(input).toBeDisabled();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Invalid input",
    "aria-invalid": true
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-3 w-64">
      <Input type="text" placeholder="Text" />
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Input type="number" placeholder="Number" />
      <Input type="search" placeholder="Search..." />
    </div>
}`,...h.parameters?.docs?.source}}},g=[`Default`,`WithLabel`,`Disabled`,`Invalid`,`Types`]}))();export{d as Default,p as Disabled,m as Invalid,h as Types,f as WithLabel,g as __namedExportsOrder,u as default};