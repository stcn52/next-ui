import{n as e}from"./chunk-zsgVPwQN.js";import{a as t,n,t as r}from"./utils-cUModyxV.js";import{n as i,t as a}from"./Separator-bwWktTJO.js";var o=e((()=>{i()}));function s({className:e,orientation:t=`horizontal`,...n}){return(0,c.jsx)(a,{"data-slot":`separator`,orientation:t,className:r(`shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch`,e),...n})}var c,l=e((()=>{o(),n(),c=t(),s.__docgenInfo={description:``,methods:[],displayName:`Separator`,props:{orientation:{defaultValue:{value:`"horizontal"`,computed:!1},required:!1}}}})),u,d,f,p,m;e((()=>{l(),u=t(),d={title:`UI/Separator`,component:s,tags:[`autodocs`]},f={render:()=>(0,u.jsxs)(`div`,{className:`w-64 flex flex-col gap-3`,children:[(0,u.jsx)(`p`,{className:`text-sm`,children:`Above the separator`}),(0,u.jsx)(s,{}),(0,u.jsx)(`p`,{className:`text-sm`,children:`Below the separator`})]})},p={render:()=>(0,u.jsxs)(`div`,{className:`flex h-12 items-center gap-3`,children:[(0,u.jsx)(`span`,{className:`text-sm`,children:`Left`}),(0,u.jsx)(s,{orientation:`vertical`}),(0,u.jsx)(`span`,{className:`text-sm`,children:`Right`})]})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-64 flex flex-col gap-3">
      <p className="text-sm">Above the separator</p>
      <Separator />
      <p className="text-sm">Below the separator</p>
    </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex h-12 items-center gap-3">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
}`,...p.parameters?.docs?.source}}},m=[`Horizontal`,`Vertical`]}))();export{f as Horizontal,p as Vertical,m as __namedExportsOrder,d as default};