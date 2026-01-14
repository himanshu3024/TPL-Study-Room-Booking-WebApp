# How to Host TPL Booking App on Azure (Free)

Since you have an Azure Subscription (Pay-As-You-Go), you can use **Azure Static Web Apps** to host this Next.js application for **$0/month** by selecting the "Free" plan.

## Prerequisites
1.  **GitHub Account**: Your code must be pushed to a GitHub repository.
2.  **Azure Account**: You already have this.

---

## Step 1: Push Code to GitHub
If you haven't already, ensure this project is in a GitHub repository.
1.  Go to [GitHub.com](https://github.com) and create a new **public** or **private** repository (e.g., `tpl-booking-system`).
2.  Push your local code to this repository.

## Step 2: Create Static Web App Resource
1.  Log in to the [Azure Portal](https://portal.azure.com).
2.  In the top search bar, type **"Static Web Apps"** and select it.
3.  Click **+ Create** (top left).
4.  Fill in the **Basics** tab:
    *   **Subscription**: Select your "Pay-As-You-Go" subscription.
    *   **Resource Group**: Click "Create new" and name it (e.g., `TPL-Booking-RG`).
    *   **Name**: Give your app a name (e.g., `tpl-staff-booking`).
    *   **Plan type**: Select **Free** (This is crucial for $0 cost).
    *   **Deployment details**: Select **GitHub**.

## Step 3: Connect to GitHub
1.  Click the button **Sign in with GitHub**.
2.  Authorize Azure to access your repositories.
3.  A form will appear. Select:
    *   **Organization**: Your GitHub username.
    *   **Repository**: `tpl-booking-system` (or whatever you named it).
    *   **Branch**: `main` (or `master`).

## Step 4: Build Details
1.  In the **Build Details** section, look for "Build Presets".
2.  Select **Next.js** from the dropdown.
3.  The default settings should be correct:
    *   **App location**: `/`
    *   **Api location**: (Leave empty)
    *   **Output location**: (Leave empty or default)

## Step 5: Review and Create
1.  Click **Review + create** at the bottom.
2.  Review the summary. Ensure it says "Free" plan.
3.  Click **Create**.

## Step 6: Visit Your Site
1.  Wait about 1-2 minutes for the deployment to finish.
2.  Click **Go to resource**.
3.  On the Overview page, you will see a **URL** on the right side (something like `purple-river-12345.azurestaticapps.net`).
4.  Click that link to see your live app!

---

## Troubleshooting
*   **Workflow Failure?**: If the site doesn't load, go to your GitHub repository -> click **Actions** tab. You can see the build logs there to verify if it failed or succeeded.
*   **Environment Variables**: If you add a database later, you will need to add environment variables in the Azure Portal under **Settings -> Environment variables**.
