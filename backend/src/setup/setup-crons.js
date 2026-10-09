import { startWorkflowExecutionCron } from "../crons/workflow-execution.cron.js";

const setupCrons = () => {
    startWorkflowExecutionCron();
};

export default setupCrons;
