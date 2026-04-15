import{n as e}from"./chunk-zsgVPwQN.js";import{t}from"./react-C184PLS3.js";import{h as n,p as r}from"./useRenderElement-BEIMEjYa.js";import{a as i,n as a,t as o}from"./utils-cUModyxV.js";import{m as s,t as c,y as l}from"./lucide-react-BFQVNN2r.js";import{n as u,t as d}from"./use-render-Be2kdh8s.js";function f({className:e,...t}){return(0,y.jsx)(`nav`,{"aria-label":`breadcrumb`,"data-slot":`breadcrumb`,className:o(e),...t})}function p({className:e,...t}){return(0,y.jsx)(`ol`,{"data-slot":`breadcrumb-list`,className:o(`flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground`,e),...t})}function m({className:e,...t}){return(0,y.jsx)(`li`,{"data-slot":`breadcrumb-item`,className:o(`inline-flex items-center gap-1`,e),...t})}function h({className:e,render:t,...r}){return u({defaultTagName:`a`,props:n({className:o(`transition-colors hover:text-foreground`,e)},r),render:t,state:{slot:`breadcrumb-link`}})}function g({className:e,...t}){return(0,y.jsx)(`span`,{"data-slot":`breadcrumb-page`,role:`link`,"aria-disabled":`true`,"aria-current":`page`,className:o(`font-normal text-foreground`,e),...t})}function _({children:e,className:t,...n}){return(0,y.jsx)(`li`,{"data-slot":`breadcrumb-separator`,role:`presentation`,"aria-hidden":`true`,className:o(`[&>svg]:size-3.5`,t),...n,children:e??(0,y.jsx)(l,{})})}function v({className:e,...t}){return(0,y.jsxs)(`span`,{"data-slot":`breadcrumb-ellipsis`,role:`presentation`,"aria-hidden":`true`,className:o(`flex size-5 items-center justify-center [&>svg]:size-4`,e),...t,children:[(0,y.jsx)(s,{}),(0,y.jsx)(`span`,{className:`sr-only`,children:`More`})]})}var y,b=e((()=>{t(),r(),d(),a(),c(),y=i(),f.__docgenInfo={description:``,methods:[],displayName:`Breadcrumb`},p.__docgenInfo={description:``,methods:[],displayName:`BreadcrumbList`},m.__docgenInfo={description:``,methods:[],displayName:`BreadcrumbItem`},g.__docgenInfo={description:``,methods:[],displayName:`BreadcrumbPage`},_.__docgenInfo={description:``,methods:[],displayName:`BreadcrumbSeparator`},v.__docgenInfo={description:``,methods:[],displayName:`BreadcrumbEllipsis`}})),x,S,C,w,T;e((()=>{b(),x=i(),S={title:`UI/Breadcrumb`,component:f,tags:[`autodocs`]},C={render:()=>(0,x.jsx)(f,{children:(0,x.jsxs)(p,{children:[(0,x.jsx)(m,{children:(0,x.jsx)(h,{href:`/`,children:`Home`})}),(0,x.jsx)(_,{}),(0,x.jsx)(m,{children:(0,x.jsx)(h,{href:`/components`,children:`Components`})}),(0,x.jsx)(_,{}),(0,x.jsx)(m,{children:(0,x.jsx)(g,{children:`Breadcrumb`})})]})})},w={render:()=>(0,x.jsx)(f,{children:(0,x.jsxs)(p,{children:[(0,x.jsx)(m,{children:(0,x.jsx)(h,{href:`/`,children:`Home`})}),(0,x.jsx)(_,{}),(0,x.jsx)(m,{children:(0,x.jsx)(v,{})}),(0,x.jsx)(_,{}),(0,x.jsx)(m,{children:(0,x.jsx)(h,{href:`/components`,children:`Components`})}),(0,x.jsx)(_,{}),(0,x.jsx)(m,{children:(0,x.jsx)(g,{children:`Breadcrumb`})})]})})},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
}`,...w.parameters?.docs?.source}}},T=[`Default`,`WithEllipsis`]}))();export{C as Default,w as WithEllipsis,T as __namedExportsOrder,S as default};