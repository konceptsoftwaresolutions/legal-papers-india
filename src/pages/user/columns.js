export const columns = [
  {
    name: "Name",
    selector: (row) => row?.name || "-",
    wrap: true,
    style: { textAlign: "left", paddingLeft: "16px" },
    width: "200px",
  },
  {
    name: "Email",
    selector: (row) => row?.email || "-",
    wrap: true,
    width: "350px",
    style: { textAlign: "left", paddingLeft: "16px" },
  },
  {
    name: "Mobile",
    selector: (row) => row?.mobile || "-",
    wrap: true,
    width: "150px",
    style: { textAlign: "left", paddingLeft: "16px" },
  },
  {
    name: "Profile",
    selector: (row) => row?.profile || "-",
    wrap: true,
    width: "250px",
    style: { textAlign: "left", paddingLeft: "16px" },
  },
];

export const callColumns = [
  {
    name: "Name",
    selector: (row) => row.name || '-',
  },
  {
    name: "Mobile",
    selector: (row) => row.phoneNumber || '-',
  },
  {
    name: "Date & Time",
    selector: (row) => row.dateTime || '-',
    // cell: (row) => (
    //   <LongNameFormatter content={row.dateTime} max={30} id={row._id} />
    // ),
  },
  {
    name: "Duration",
    selector: (row) => row.duration || '-',
  },
  {
    name: "Type",
    selector: (row) => row.type || '-',
  },
];


export const waTemplateColumnns = [
  {
    name: "Lead ID",
    selector: (row) => row.leadId || '-',
  },
]