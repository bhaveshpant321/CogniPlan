# 🛰️ CogniPlan: Engineering Protocol

We are moving to a **Branch-per-Feature** workflow.

1. **The Golden Rule:** No one pushes directly to `main` or `dev`.
2. **Your Workspace:** Stay inside your assigned `role-x` folder. Do not modify files in other folders without a sync.
3. **Working on a Feature:**

	```bash
	git checkout dev
	git pull origin dev
	git checkout -b feature/your-name-task-description
	```

4. **Submitting Work:** Push your branch and open a Pull Request (PR) to `dev`. The checker runs automatically. If it fails (red ❌), fix errors before merge.
5. **Folder Ownership:**
	- **Role 1:** Database, API, and SRS Logic.
	- **Role 2:** Sockets, Video Sync, and Whiteboard Engine.
	- **Role 3:** UI, Dashboards, and Visual Integration.