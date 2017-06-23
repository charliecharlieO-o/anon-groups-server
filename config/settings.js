module.exports = {
	"priviledges": [ "delete_board", "create_board", "edit_board", "admin_board", "promote_user",
        "create_user", "delete_user", "edit_user", "search_user", "ban_user", "unban_user",
				"delete_comment", "can_reply", "can_post", "delete_thread", "admin_admins", "admin_issues"
  ],
  "max_info_requests": 500,
  "max_alerts": 1000,
	"max_alive_posts": 1,
  "issue_categories": [ "SPAM", "ILLEGAL", "RULES", "BUG", "SECURITY", "INAPROPRIATE", "USER" ],
  "max_board_search_count": 20,
  "recent_search_range": 7200, // Seconds
  "max_list_search_results": 300,
	"max_thread_search_resutls": 55,
	"excerpts_per_thread": 3,
	"excerpts_substring": 30,
	"max_user_search_results": 50,
	"max_notif_list_results": 300,
	"max_thread_replies": 500, // Maximum nunmber of replies per thread
	"max_reply_subreplies": 50, // Maximum number of sub-replies per reply
	"creme_of_the_top_max": 10
	// Max file size
};
