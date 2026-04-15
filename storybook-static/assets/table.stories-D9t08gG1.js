import{n as e}from"./chunk-zsgVPwQN.js";import{t}from"./react-C184PLS3.js";import{n,r,t as i}from"./jsx-runtime-BAjPxNjI.js";function a({className:e,...t}){return(0,p.jsx)(`div`,{"data-slot":`table-container`,className:`relative w-full overflow-x-auto`,children:(0,p.jsx)(`table`,{"data-slot":`table`,className:n(`w-full caption-bottom text-sm`,e),...t})})}function o({className:e,...t}){return(0,p.jsx)(`thead`,{"data-slot":`table-header`,className:n(`[&_tr]:border-b`,e),...t})}function s({className:e,...t}){return(0,p.jsx)(`tbody`,{"data-slot":`table-body`,className:n(`[&_tr:last-child]:border-0`,e),...t})}function c({className:e,...t}){return(0,p.jsx)(`tfoot`,{"data-slot":`table-footer`,className:n(`border-t bg-muted/50 font-medium [&>tr]:last:border-b-0`,e),...t})}function l({className:e,...t}){return(0,p.jsx)(`tr`,{"data-slot":`table-row`,className:n(`border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted`,e),...t})}function u({className:e,...t}){return(0,p.jsx)(`th`,{"data-slot":`table-head`,className:n(`h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0`,e),...t})}function d({className:e,...t}){return(0,p.jsx)(`td`,{"data-slot":`table-cell`,className:n(`p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0`,e),...t})}function f({className:e,...t}){return(0,p.jsx)(`caption`,{"data-slot":`table-caption`,className:n(`mt-4 text-sm text-muted-foreground`,e),...t})}var p,m=e((()=>{t(),r(),p=i(),a.__docgenInfo={description:``,methods:[],displayName:`Table`},o.__docgenInfo={description:``,methods:[],displayName:`TableHeader`},s.__docgenInfo={description:``,methods:[],displayName:`TableBody`},c.__docgenInfo={description:``,methods:[],displayName:`TableFooter`},u.__docgenInfo={description:``,methods:[],displayName:`TableHead`},l.__docgenInfo={description:``,methods:[],displayName:`TableRow`},d.__docgenInfo={description:``,methods:[],displayName:`TableCell`},f.__docgenInfo={description:``,methods:[],displayName:`TableCaption`}})),h,g,_,v,y;e((()=>{m(),h=i(),g={title:`UI/Table`,component:a,tags:[`autodocs`]},_=[{invoice:`INV001`,status:`Paid`,method:`Credit Card`,amount:`$250.00`},{invoice:`INV002`,status:`Pending`,method:`PayPal`,amount:`$150.00`},{invoice:`INV003`,status:`Unpaid`,method:`Bank Transfer`,amount:`$350.00`},{invoice:`INV004`,status:`Paid`,method:`Credit Card`,amount:`$450.00`}],v={render:()=>(0,h.jsxs)(a,{children:[(0,h.jsx)(f,{children:`A list of recent invoices.`}),(0,h.jsx)(o,{children:(0,h.jsxs)(l,{children:[(0,h.jsx)(u,{className:`w-32`,children:`Invoice`}),(0,h.jsx)(u,{children:`Status`}),(0,h.jsx)(u,{children:`Method`}),(0,h.jsx)(u,{className:`text-right`,children:`Amount`})]})}),(0,h.jsx)(s,{children:_.map(e=>(0,h.jsxs)(l,{children:[(0,h.jsx)(d,{className:`font-medium`,children:e.invoice}),(0,h.jsx)(d,{children:e.status}),(0,h.jsx)(d,{children:e.method}),(0,h.jsx)(d,{className:`text-right`,children:e.amount})]},e.invoice))}),(0,h.jsx)(c,{children:(0,h.jsxs)(l,{children:[(0,h.jsx)(d,{colSpan:3,children:`Total`}),(0,h.jsx)(d,{className:`text-right`,children:`$1,200.00`})]})})]})},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <Table>
      <TableCaption>A list of recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-32">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map(row => <TableRow key={row.invoice}>
            <TableCell className="font-medium">{row.invoice}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>{row.method}</TableCell>
            <TableCell className="text-right">{row.amount}</TableCell>
          </TableRow>)}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$1,200.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
}`,...v.parameters?.docs?.source}}},y=[`Default`]}))();export{v as Default,y as __namedExportsOrder,g as default};