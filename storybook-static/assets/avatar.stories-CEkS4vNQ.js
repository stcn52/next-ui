import{n as e}from"./chunk-zsgVPwQN.js";import{a as t}from"./utils-cUModyxV.js";import{i as n,n as r,r as i,t as a}from"./avatar-vRDcRyRZ.js";var o,s,c,l,u,d,f,p;e((()=>{n(),o=t(),{expect:s,within:c}=__STORYBOOK_MODULE_TEST__,l={title:`UI/Avatar`,component:a,tags:[`autodocs`],argTypes:{size:{control:`select`,options:[`sm`,`default`,`lg`]}}},u={render:()=>(0,o.jsxs)(a,{children:[(0,o.jsx)(i,{src:`https://github.com/shadcn.png`,alt:`shadcn`}),(0,o.jsx)(r,{children:`CN`})]}),play:async({canvasElement:e})=>{await s(c(e).getByRole(`img`,{name:/shadcn/i})).toBeInTheDocument()}},d={render:()=>(0,o.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,o.jsxs)(a,{size:`sm`,children:[(0,o.jsx)(i,{src:`https://github.com/shadcn.png`,alt:`shadcn`}),(0,o.jsx)(r,{children:`SM`})]}),(0,o.jsxs)(a,{size:`default`,children:[(0,o.jsx)(i,{src:`https://github.com/shadcn.png`,alt:`shadcn`}),(0,o.jsx)(r,{children:`MD`})]}),(0,o.jsxs)(a,{size:`lg`,children:[(0,o.jsx)(i,{src:`https://github.com/shadcn.png`,alt:`shadcn`}),(0,o.jsx)(r,{children:`LG`})]})]})},f={render:()=>(0,o.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,o.jsx)(a,{size:`sm`,children:(0,o.jsx)(r,{children:`AB`})}),(0,o.jsx)(a,{size:`default`,children:(0,o.jsx)(r,{children:`CY`})}),(0,o.jsx)(a,{size:`lg`,children:(0,o.jsx)(r,{children:`XY`})})]})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByRole("img", {
      name: /shadcn/i
    });
    await expect(avatar).toBeInTheDocument();
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <Avatar size="sm"><AvatarFallback>AB</AvatarFallback></Avatar>
      <Avatar size="default"><AvatarFallback>CY</AvatarFallback></Avatar>
      <Avatar size="lg"><AvatarFallback>XY</AvatarFallback></Avatar>
    </div>
}`,...f.parameters?.docs?.source}}},p=[`Default`,`AllSizes`,`Fallback`]}))();export{d as AllSizes,u as Default,f as Fallback,p as __namedExportsOrder,l as default};