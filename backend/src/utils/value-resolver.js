import jq from 'node-jq';

export const resolveValue = async (context, val) => {
    if (typeof val === 'string' && (val.startsWith('$.') || val.startsWith('.'))) {
        let filter = val;
        // Convert JSONPath style $. to jq style .
        if (filter.startsWith('$.')) {
            filter = filter.substring(1);
        }
        
        if (Array.isArray(context) && filter.startsWith('.')) {
            // Check if it's a simple accessor to map over the array
            // e.g. .location.city -> map(.location.city)
            if (!filter.includes('[]') && !filter.startsWith('map(')) {
                filter = `map(${filter})`;
            }
        }
        
        try {
            const result = await jq.run(filter, context, { input: 'json', output: 'json' });
            return result;
        } catch (error) {
            console.error(`Error resolving jq expression '${filter}':`, error);
            return undefined;
        }
    }
    return val;
};
