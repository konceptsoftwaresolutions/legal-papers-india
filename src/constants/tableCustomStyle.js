export const tableCustomStyles = {
    header: {
        style: {
            fontSize: '16px',
            fontFamily: 'Poppins, sans-serif',
            // backgroundColor: '#000000',
            color: '#FFFFFF',
        },
    },
    headRow: {
        style: {
            background: 'linear-gradient(170.56deg, #313131, #292929 22.61%, #161616 54.08%, #000)',
            // borderTopLeftRadius: '6px',   // To round top corners of header row
            // borderTopRightRadius: '6px',
        },
    },
    headCells: {
        style: {
            color: '#FFFFFF',
            fontFamily: 'Poppins, sans-serif',
            fontSize:'15px',
            fontWeight: 'semibold',
            textAlign: 'center',
        },
    },
    rows: {
        style: {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            borderBottomColor: '#e0e0e0',
            cursor:"pointer",
        },
    },
    cells: {
        style: {
            padding: '10px',  // Padding for table cells
            textAlign: 'center',
        },
    },
    container: {
        style: {
            borderRadius: '10px',               // Rounding for the entire table
            overflow: 'hidden',                // Ensure the content stays within rounded borders
            border: '1px solid #e0e0e0',       // Optional border for the table
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Added box shadow
        },
    },
    tableWrapper: {
        style: {
            borderRadius: '5px',               // Rounding for the entire table
            overflow: 'hidden',                // Ensure the content stays within rounded borders
            border: '1px solid #e0e0e0',       // Optional border for the table
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Added box shadow
        },
    },
};
