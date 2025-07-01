const ABILITY = {
    superAdmin: {
        pages: [],
    },
    salesExecutive: {
        pages: ['follow-ups'],
    },
    salesTl: {
        pages: ['follow-ups', 'total-leads', 'total-nc-bucket', 'assigned-nc-bucket'],
    },
    operationsExecutive: {
        pages: ['bucket', 'no-claim-bucket', 'users', 'total-leads', 'total-nc-bucket', 'assigned-nc-bucket'],
    },
    operationsTl: {
        pages: ['no-claim-bucket', 'important-leads'],
    },
}

export default ABILITY;