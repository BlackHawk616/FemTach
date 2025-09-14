This Is The Page Flow And Strcuture Of The Website Version

### Pages & Flow

1. **Login / Signup Page**
   - Simple form with email + password.
   - If account doesn’t exist, auto-create a new account.
   - Use a clean card-style layout, centered on the screen.

2. **Onboarding Page (first login only)**
   - Collect user details:
     - Name, Age, Height, Weight.
     - Diet preference (Veg / Non-Veg / Vegan).
     - Lifestyle goals (fitness, cycle tracking, wellness).
   - Save to database (placeholder).

3. **Dashboard Page**
   - Top section: Greeting with user’s name.
   - Metrics grid (cards):
     - Steps counter
     - Calories burned
     - Cycle tracker (calendar widget + prediction highlights)
     - Hydration reminder (progress bar)
     - Daily motivational quote (fetched from AI or placeholder API)
   - Right sidebar: AI wellness assistant (chatbox for user to ask about health/diet).

4. **Mental Health Tracker Page**
   - Mood tracker widget (Happy / Sad / Neutral).
   - Journal entry (textarea to log feelings).
   - Show past mood logs in a list with date/time.
   - Optional: AI analysis card that shows “Your mood trend this week” (placeholder chart).

5. **Profile Page**
   - Display profile info (name, age, height, weight, diet, lifestyle).
   - Option to edit and update info.
   - Account settings (change password, logout).
   - Display simple analytics: BMI calculator, progress history.

6. **Navigation**
   - Top or side navigation bar with links: **Dashboard | Mental Health | Profile**.
   - Keep navigation consistent on all pages.

### Design Guidelines
- Clean, modern UI with soft colors (pink, lavender, white theme).
- Use cards, grids, and charts for metrics.
- Ensure PC-first layout, responsive for larger screens.
- Placeholders for charts and AI responses — backend will be added later.

### Notes
- Do not implement SOS/emergency features.
- All data should be **fetched from a central database** (simulate with dummy API).
- If a user logs in without an account, create a new one and redirect to onboarding.
- Focus only on **UI scaffolding** and page flows.
