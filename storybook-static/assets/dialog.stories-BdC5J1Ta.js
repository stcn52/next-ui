import{n as e}from"./chunk-zsgVPwQN.js";import{a as t}from"./utils-cUModyxV.js";import{n,t as r}from"./button-Du_8gkil.js";import{n as i,t as a}from"./label-CxgXa4VD.js";import{a as o,c as s,i as c,l,n as u,o as d,r as f,s as p,t as m}from"./dialog-C6WpUkw7.js";import{n as h,t as g}from"./input-HeFw5pcv.js";var _,v,y,b,x,S,C,w;e((()=>{l(),n(),h(),i(),_=t(),{expect:v,userEvent:y,within:b}=__STORYBOOK_MODULE_TEST__,x={title:`UI/Dialog`,tags:[`autodocs`]},S={render:()=>(0,_.jsxs)(m,{children:[(0,_.jsx)(s,{render:(0,_.jsx)(r,{children:`Open Dialog`})}),(0,_.jsxs)(f,{children:[(0,_.jsxs)(d,{children:[(0,_.jsx)(p,{children:`Edit Profile`}),(0,_.jsx)(c,{children:`Make changes to your profile here. Click save when you're done.`})]}),(0,_.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,_.jsxs)(`div`,{className:`flex flex-col gap-1.5`,children:[(0,_.jsx)(a,{htmlFor:`name`,children:`Name`}),(0,_.jsx)(g,{id:`name`,defaultValue:`John Doe`})]}),(0,_.jsxs)(`div`,{className:`flex flex-col gap-1.5`,children:[(0,_.jsx)(a,{htmlFor:`username`,children:`Username`}),(0,_.jsx)(g,{id:`username`,defaultValue:`@johndoe`})]})]}),(0,_.jsxs)(o,{children:[(0,_.jsx)(u,{render:(0,_.jsx)(r,{variant:`outline`,children:`Cancel`})}),(0,_.jsx)(r,{children:`Save changes`})]})]})]}),play:async({canvasElement:e})=>{let t=b(e).getByRole(`button`,{name:/open dialog/i});await v(t).toBeInTheDocument(),await y.click(t);let n=b(document.body);await v(n.getByRole(`dialog`)).toBeInTheDocument(),await v(n.getByText(`Edit Profile`)).toBeInTheDocument()}},C={render:()=>(0,_.jsxs)(m,{children:[(0,_.jsx)(s,{render:(0,_.jsx)(r,{variant:`destructive`,children:`Delete Account`})}),(0,_.jsxs)(f,{children:[(0,_.jsxs)(d,{children:[(0,_.jsx)(p,{children:`Are you absolutely sure?`}),(0,_.jsx)(c,{children:`This action cannot be undone. This will permanently delete your account and remove your data from our servers.`})]}),(0,_.jsxs)(o,{children:[(0,_.jsx)(u,{render:(0,_.jsx)(r,{variant:`outline`,children:`Cancel`})}),(0,_.jsx)(r,{variant:`destructive`,children:`Delete Account`})]})]})]})},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger render={<Button>Open Dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue="@johndoe" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", {
      name: /open dialog/i
    });
    await expect(trigger).toBeInTheDocument();
    await userEvent.click(trigger);
    const dialog = within(document.body);
    await expect(dialog.getByRole("dialog")).toBeInTheDocument();
    await expect(dialog.getByText("Edit Profile")).toBeInTheDocument();
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger render={<Button variant="destructive">Delete Account</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button variant="destructive">Delete Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...C.parameters?.docs?.source}}},w=[`Default`,`Confirmation`]}))();export{C as Confirmation,S as Default,w as __namedExportsOrder,x as default};