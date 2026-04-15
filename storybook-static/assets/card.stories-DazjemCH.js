import{n as e}from"./chunk-zsgVPwQN.js";import{a as t}from"./utils-cUModyxV.js";import{n,t as r}from"./button-Du_8gkil.js";import{a as i,i as a,n as o,o as s,r as c,s as l,t as u}from"./card-DpuaunI8.js";import{n as d,t as f}from"./badge-BLgptYpa.js";var p,m,h,g,_,v;e((()=>{l(),n(),d(),p=t(),m={title:`UI/Card`,component:u,tags:[`autodocs`],argTypes:{size:{control:`select`,options:[`default`,`sm`]}}},h={render:()=>(0,p.jsxs)(u,{className:`w-80`,children:[(0,p.jsxs)(i,{children:[(0,p.jsx)(s,{children:`Card Title`}),(0,p.jsx)(c,{children:`Card description goes here.`})]}),(0,p.jsx)(o,{children:(0,p.jsx)(`p`,{className:`text-muted-foreground text-sm`,children:`This is the card content area.`})}),(0,p.jsxs)(a,{className:`flex justify-end gap-2`,children:[(0,p.jsx)(r,{variant:`outline`,size:`sm`,children:`Cancel`}),(0,p.jsx)(r,{size:`sm`,children:`Confirm`})]})]})},g={render:()=>(0,p.jsxs)(u,{className:`w-80`,children:[(0,p.jsxs)(i,{children:[(0,p.jsx)(s,{children:`Project Status`}),(0,p.jsx)(`div`,{"data-slot":`card-action`,children:(0,p.jsx)(f,{variant:`secondary`,children:`Beta`})}),(0,p.jsx)(c,{children:`Current project overview.`})]}),(0,p.jsx)(o,{children:(0,p.jsx)(`p`,{className:`text-muted-foreground text-sm`,children:`Everything is running smoothly.`})})]})},_={render:()=>(0,p.jsxs)(u,{className:`w-72`,size:`sm`,children:[(0,p.jsxs)(i,{children:[(0,p.jsx)(s,{children:`Small Card`}),(0,p.jsx)(c,{children:`Compact size variant.`})]}),(0,p.jsx)(o,{children:(0,p.jsx)(`p`,{className:`text-muted-foreground text-sm`,children:`Compact content.`})})]})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          This is the card content area.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm">Confirm</Button>
      </CardFooter>
    </Card>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-80">
      <CardHeader>
        <CardTitle>Project Status</CardTitle>
        <div data-slot="card-action">
          <Badge variant="secondary">Beta</Badge>
        </div>
        <CardDescription>Current project overview.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Everything is running smoothly.
        </p>
      </CardContent>
    </Card>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-72" size="sm">
      <CardHeader>
        <CardTitle>Small Card</CardTitle>
        <CardDescription>Compact size variant.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">Compact content.</p>
      </CardContent>
    </Card>
}`,..._.parameters?.docs?.source}}},v=[`Default`,`WithBadge`,`Small`]}))();export{h as Default,_ as Small,g as WithBadge,v as __namedExportsOrder,m as default};