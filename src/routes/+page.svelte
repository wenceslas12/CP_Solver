<script>
    import {P, Heading, Card} from "flowbite-svelte";
</script>


<div class="container">

    <div class="text-container">
        <Card size="xl" class="grid md:grid-cols-1">
            <div>
                <Heading tag="h1">Calculating CPM</Heading>
                <P>Calculating the Critical Path Method (CPM) involves a systematic process of identifying and analyzing
                    the
                    sequence of activities within a project to determine the critical path and overall project duration.
                    Initially, all project activities are listed along with their respective durations and dependencies.
                    These
                    dependencies establish the order in which tasks must be executed. By constructing a network diagram,
                    typically in the form of a precedence diagram or a Gantt chart, project managers visualize the flow
                    of
                    activities and their interrelationships. The next step involves calculating the earliest start and
                    finish
                    times for each activity, considering dependencies and duration estimates. Subsequently, the latest
                    start and
                    finish times are determined by working backward from the project deadline, ensuring that no slack
                    time is
                    introduced. The critical path is then identified, consisting of activities with zero slack, meaning
                    any
                    delay in these tasks will directly impact the project's overall duration. Through careful analysis
                    and
                    adjustment of task durations and dependencies, project managers optimize the schedule to meet
                    project
                    objectives efficiently. </P>
            </div>
            <div>
                <Heading tag="h1">Calculating PERT</Heading>
                <P>Calculating the Program Evaluation and Review Technique (PERT) involves a probabilistic approach to
                    project scheduling that considers uncertainties in task durations. Initially, project managers
                    identify all activities required to complete the project and estimate three time estimates for each
                    activity: optimistic (O), most likely (M), and pessimistic (P). These estimates reflect the
                    best-case, most probable, and worst-case scenarios for task completion. With these estimates, the
                    expected duration (TE) for each activity is calculated using the formula TE = (O + 4M + P) / 6.
                    Subsequently, the critical path is determined by analyzing the network diagram constructed from
                    these estimated durations, taking into account dependencies between tasks. The critical path
                    represents the longest sequence of dependent activities, determining the minimum project duration.
                    PERT also calculates the variance for each activity to quantify the uncertainty associated with task
                    durations, aiding in risk analysis and management. Through PERT analysis, project managers gain
                    insights into project timelines, identify critical activities, and assess the probability of meeting
                    project deadlines. This method enables more informed decision-making and enhances project planning
                    and control in environments characterized by uncertainty.
                </P>
            </div>
        </Card>
    </div>

</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin: 20px;
    }

    .text-container {
        flex: 1; /* This will make the text take up the available space */
        margin-right: 20px; /* Adjust as needed */
    }
</style>
