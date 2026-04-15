import{n as e}from"./chunk-zsgVPwQN.js";import{t}from"./react-C184PLS3.js";import{a as n,n as r,t as i}from"./utils-cUModyxV.js";import{n as a,t as o}from"./lucide-react-BFQVNN2r.js";import{a as s,d as c,h as l,l as u,p as d,r as f,s as p,t as m}from"./DialogTrigger-B89kOQhj.js";import{n as h,t as g}from"./button-Du_8gkil.js";import{n as _,t as v}from"./label-CxgXa4VD.js";import{t as y}from"./dialog-CTpvQpMP.js";import{n as b,t as x}from"./input-HeFw5pcv.js";function S({...e}){return(0,M.jsx)(l,{"data-slot":`sheet`,...e})}function C({...e}){return(0,M.jsx)(m,{"data-slot":`sheet-trigger`,...e})}function w({...e}){return(0,M.jsx)(c,{"data-slot":`sheet-close`,...e})}function T({...e}){return(0,M.jsx)(s,{"data-slot":`sheet-portal`,...e})}function E({className:e,...t}){return(0,M.jsx)(d,{"data-slot":`sheet-overlay`,className:i(`fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs`,e),...t})}function D({className:e,children:t,side:n=`right`,showCloseButton:r=!0,...o}){return(0,M.jsxs)(T,{children:[(0,M.jsx)(E,{}),(0,M.jsxs)(p,{"data-slot":`sheet-content`,"data-side":n,className:i(`fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm`,e),...o,children:[t,r&&(0,M.jsxs)(c,{"data-slot":`sheet-close`,render:(0,M.jsx)(g,{variant:`ghost`,className:`absolute top-3 right-3`,size:`icon-sm`}),children:[(0,M.jsx)(a,{}),(0,M.jsx)(`span`,{className:`sr-only`,children:`Close`})]})]})]})}function O({className:e,...t}){return(0,M.jsx)(`div`,{"data-slot":`sheet-header`,className:i(`flex flex-col gap-0.5 p-4`,e),...t})}function k({className:e,...t}){return(0,M.jsx)(`div`,{"data-slot":`sheet-footer`,className:i(`mt-auto flex flex-col gap-2 p-4`,e),...t})}function A({className:e,...t}){return(0,M.jsx)(f,{"data-slot":`sheet-title`,className:i(`font-heading text-base font-medium text-foreground`,e),...t})}function j({className:e,...t}){return(0,M.jsx)(u,{"data-slot":`sheet-description`,className:i(`text-sm text-muted-foreground`,e),...t})}var M,N=e((()=>{t(),y(),r(),h(),o(),M=n(),S.__docgenInfo={description:``,methods:[],displayName:`Sheet`},C.__docgenInfo={description:``,methods:[],displayName:`SheetTrigger`},w.__docgenInfo={description:``,methods:[],displayName:`SheetClose`},D.__docgenInfo={description:``,methods:[],displayName:`SheetContent`,props:{side:{required:!1,tsType:{name:`union`,raw:`"top" | "right" | "bottom" | "left"`,elements:[{name:`literal`,value:`"top"`},{name:`literal`,value:`"right"`},{name:`literal`,value:`"bottom"`},{name:`literal`,value:`"left"`}]},description:``,defaultValue:{value:`"right"`,computed:!1}},showCloseButton:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`true`,computed:!1}}}},O.__docgenInfo={description:``,methods:[],displayName:`SheetHeader`},k.__docgenInfo={description:``,methods:[],displayName:`SheetFooter`},A.__docgenInfo={description:``,methods:[],displayName:`SheetTitle`},j.__docgenInfo={description:``,methods:[],displayName:`SheetDescription`}})),P,F,I,L,R,z,B,V;e((()=>{N(),h(),b(),_(),P=n(),{expect:F,userEvent:I,within:L}=__STORYBOOK_MODULE_TEST__,R={title:`UI/Sheet`,tags:[`autodocs`]},z={render:()=>(0,P.jsxs)(S,{children:[(0,P.jsx)(C,{render:(0,P.jsx)(g,{variant:`outline`,children:`Open Sheet`})}),(0,P.jsxs)(D,{children:[(0,P.jsxs)(O,{children:[(0,P.jsx)(A,{children:`Edit Profile`}),(0,P.jsx)(j,{children:`Make changes to your profile here. Click save when you're done.`})]}),(0,P.jsxs)(`div`,{className:`flex flex-col gap-4 px-4 pb-4`,children:[(0,P.jsxs)(`div`,{className:`flex flex-col gap-1.5`,children:[(0,P.jsx)(v,{htmlFor:`sheet-name`,children:`Name`}),(0,P.jsx)(x,{id:`sheet-name`,defaultValue:`Pedro Duarte`})]}),(0,P.jsxs)(`div`,{className:`flex flex-col gap-1.5`,children:[(0,P.jsx)(v,{htmlFor:`sheet-username`,children:`Username`}),(0,P.jsx)(x,{id:`sheet-username`,defaultValue:`@peduarte`})]})]}),(0,P.jsxs)(k,{children:[(0,P.jsx)(g,{children:`Save changes`}),(0,P.jsx)(w,{render:(0,P.jsx)(g,{variant:`outline`,children:`Cancel`})})]})]})]}),play:async({canvasElement:e})=>{let t=L(e).getByRole(`button`,{name:/open sheet/i});await F(t).toBeInTheDocument(),await I.click(t),await F(L(document.body).getByText(`Edit Profile`)).toBeInTheDocument()}},B={render:()=>(0,P.jsxs)(S,{children:[(0,P.jsx)(C,{render:(0,P.jsx)(g,{variant:`outline`,children:`Left Sheet`})}),(0,P.jsxs)(D,{side:`left`,children:[(0,P.jsxs)(O,{children:[(0,P.jsx)(A,{children:`Navigation`}),(0,P.jsx)(j,{children:`Quick access to navigation.`})]}),(0,P.jsxs)(`div`,{className:`flex flex-col gap-2 px-4`,children:[(0,P.jsx)(g,{variant:`ghost`,className:`justify-start`,children:`Home`}),(0,P.jsx)(g,{variant:`ghost`,className:`justify-start`,children:`Profile`}),(0,P.jsx)(g,{variant:`ghost`,className:`justify-start`,children:`Settings`})]})]})]})},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: () => <Sheet>
      <SheetTrigger render={<Button variant="outline">Open Sheet</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 pb-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sheet-name">Name</Label>
            <Input id="sheet-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sheet-username">Username</Label>
            <Input id="sheet-username" defaultValue="@peduarte" />
          </div>
        </div>
        <SheetFooter>
          <Button>Save changes</Button>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", {
      name: /open sheet/i
    });
    await expect(trigger).toBeInTheDocument();
    await userEvent.click(trigger);
    const body = within(document.body);
    await expect(body.getByText("Edit Profile")).toBeInTheDocument();
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: () => <Sheet>
      <SheetTrigger render={<Button variant="outline">Left Sheet</Button>} />
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Quick access to navigation.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-4">
          <Button variant="ghost" className="justify-start">Home</Button>
          <Button variant="ghost" className="justify-start">Profile</Button>
          <Button variant="ghost" className="justify-start">Settings</Button>
        </div>
      </SheetContent>
    </Sheet>
}`,...B.parameters?.docs?.source}}},V=[`Default`,`LeftSide`]}))();export{z as Default,B as LeftSide,V as __namedExportsOrder,R as default};