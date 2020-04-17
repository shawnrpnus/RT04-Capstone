package capstone.rt04.retailbackend.util.routeconstants;

public class LeaveControllerRoutes {
    public static final String LEAVE_BASE_ROUTE = "/api/leave";
    public static final String APPLY_FOR_LEAVE = "/applyForLeave";
    public static final String UPDATE_LEAVE = "/updateLeave";
    public static final String DELETE_LEAVE = "/deleteLeave/{leaveId}";
    public static final String RETRIEVE_ALL_LEAVES = "/retrieveAllLeaves/{staffId}"; //for staff to retrieve all his/her leaves
    public static final String RETRIEVE_ALL_LEAVES_MANAGER = "/retrieveAllLeavesManager/{staffId}"; //for manager to retrieve all leaves in his/her department
    public static final String RETRIEVE_ALL_PENDING_LEAVES = "/retrieveAllPendingLeaves/{staffId}"; //for manager to retrieve all pending leaves in his/her department
    public static final String RETRIEVE_ALL_ENDORSED_LEAVES = "/retrieveAllEndorsedLeaves";
    public static final String RETRIEVE_ALL_LEAVES_HR = "/retrieveAllLeavesHR"; //for hr to retrieve all endorsed leaves
    public static final String ENDORSE_REJECT_LEAVE = "/endorseRejectLeave";
    public static final String APPROVE_REJECT_LEAVE = "/approveRejectLeave";
    public static final String RETRIEVE_LEAVE_COUNT_IN_A_MONTH = "/retrieveLeaveCountInAMonth";
}
