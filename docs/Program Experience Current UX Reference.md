# **Program Experience Current UX Reference**

## **Purpose**

This document summarizes the current user experience for the program-related surfaces.

The focus areas are:

1. Program List  
2. Search Program Side Drawer  
3. Chatbot Program Side Drawer  
4. Program Page  
5. Request Information / Apply Now flow

This document is meant to give the UX designer current-state context.

# Current UX Summary

The current program experience is made from a shared set of program-detail content used across search, chatbot, and direct program page contexts.

The Program List (search experience) helps users browse programs.

The Search Program Side Drawer gives users a detailed view from search.

The Chatbot Program Side Drawer gives users a detailed view from Ally or chat.

The Program Page gives users a direct program detail experience using the same main content as the Search Program Side Drawer.

The Request Information / Apply Now flow can create a program interest, mark the interest as Information Requested, track the request origin, send data to HubSpot, and open the school application page when available.

# 

# 1\. Search: Program List

The Program List is where users browse available programs.

Users can:

* Search for programs  
* Search for schools  
* Filter results  
* Sort results  
* View program cards  
* Add programs to compare  
* Open a program detail drawer

### **Program List Header**

The page includes a large hero heading:

**Find the right program for your future**

The page also includes supporting copy:

**Search thousands of programs from top universities and find the perfect fit**

### **Search and Filters**

The current search experience includes:

* Search Programs  
* Search Schools  
* Degree Level filter  
* Course Modality filter  
* Areas of Study filter  
* Universities filter  
* Sort controls  
* Compare option

### **Program Cards**

Each program card may show:

* Discount badge  
* Program name  
* School name  
* Application deadline  
* Start date  
* Location or modality  
* Tags or metadata  
* Explore program button  
* Add to compare option

The main card action is:

**Explore program**

# 2\. Search Program Side Drawer

The Search Program Side Drawer opens when a user selects a program from search or the program list.

The drawer appears over the search experience.

The background page is dimmed while the drawer is open.

### **Main Content Order**

The drawer generally shows content in this order:

1. Discount or pricing badge  
2. School logo  
3. School name  
4. Program name  
5. Program headline or short summary  
6. Program image  
7. Primary CTA  
8. Helper text  
9. Key facts  
10. About the Program  
11. Optional concentrations  
12. Tuition or cost information  
13. Admission requirements  
14. Benefits  
15. Curriculum highlights  
16. Terms and conditions  
17. Take the Next Step area

### **Key Facts**

The drawer can show:

* Start Date  
* Duration  
* Time Commitment  
* Program Type  
* Application Deadline  
* Modality

### **Main Sections**

The drawer can include the following sections:

* About the Program  
* Optional Concentrations  
* Tuition or cost area  
* Admission Requirements  
* Benefits  
* Curriculum Highlights  
* Terms and Conditions  
* Take the Next Step

### **Common Drawer CTAs**

The drawer may include:

* Apply Now  
* Request Information  
* Schedule a Time  
* View Full Program Details  
* View Full Admission Requirements  
* View Full Curriculum Highlights  
* View Full Terms & Conditions

### **Bottom CTA Area**

The bottom of the drawer includes a **Take the Next Step** area.

This area may include two cards:

### **Fast Track Your Application**

Supporting copy:

**Ready to move forward? Start your application today. The online application is simple and takes just a few minutes to complete.**

Possible CTA:

**Apply Now**

### **Book a Call with an Advisor**

Supporting copy:

**Schedule a 20-30 minute call to get personalized guidance on program options, tuition savings, and the next steps in the application process.**

CTA:

**Schedule a Time**

# 3\. Chatbot Program Side Drawer

The Chatbot Program Side Drawer is used when a program is opened from Ally or the chatbot experience.

It uses a similar structure to the Search Program Side Drawer.

### **Chatbot Drawer Context**

The user enters this drawer after Ally or chat presents a program.

The drawer includes program details, next-step actions, and request/apply behavior.

### **Chatbot Drawer Labels**

Visible labels may include:

* Take the next step  
* Learn more  
* Ready to apply?  
* Talk to an Advisor  
* Schedule a Call  
* Apply Now  
* Request Information  
* Schedule a Time

### **Chatbot Drawer Content**

The Chatbot Program Side Drawer can show:

* School name  
* School logo  
* Program name  
* Program headline  
* Program image  
* Key facts  
* About the Program  
* Tuition or cost information  
* Admission Requirements  
* Benefits  
* Curriculum Highlights  
* Terms and Conditions  
* Next-step CTA cards

### **Request Origin**

When the user requests information from this surface, the origin is tracked as:

**Ally**

# 4\. Program Page

The Program Page is a standalone page for a program.

It includes the global header at the top.

The page uses the same main program detail content as the Search Program Side Drawer.

### **Program Page Content**

The Program Page can include:

* Header  
* Program detail hero area  
* School name  
* Program name  
* Program image  
* Primary CTA  
* Key facts  
* Long-form program sections  
* Bottom next-step cards

### **Program Page Relationship to Drawer**

The Program Page uses the Search Program Side Drawer content as its main program detail experience.

# 5\. Request Information / Apply Now Flow

Users can start the request or apply flow from multiple places.

### **Entry Points**

Users can start from:

* Search Program Side Drawer top CTA  
* Search Program Side Drawer bottom card  
* Chatbot Program Side Drawer top CTA  
* Chatbot Program Side Drawer bottom card  
* Program Page  
* Apply Now modal

### **Request Information Flow**

When a user requests information, the app may:

1. Show a loading state  
2. Create a selected-program item for the user  
3. Create or schedule a program-interest process  
4. Set the program-interest status to **Information Requested**  
5. Save the request origin as **Search** or **Ally**  
6. Send related information to HubSpot  
7. Set a success state for requested information

### **Logged-Out Behavior**

If the user is logged out, the flow routes the user to sign up or log in.

After login or signup, the request can continue.

### **Apply Now Flow**

If an application URL is available and configured, the app can open the school application page in a new tab.

### **Apply Now Modal**

The Apply Now modal can include:

* Apply Now title  
* Scheduling link  
* Body copy about speaking with an Education Benefits Specialist  
* Body copy explaining that the user will leave the website  
* Cancel button  
* Apply Now button

Visible scheduling link:

**Schedule Call with Education Benefits Specialist**

Visible modal question:

**Are you ready to proceed?**

# 6\. User-Facing Data Available

The program experience can show the following data:

* Program name  
* School name  
* School logo  
* Program image  
* Program headline  
* Program description  
* Start date  
* Application deadline  
* Duration  
* Time commitment  
* Degree level  
* Program type  
* Course modality  
* Discount label  
* Discount amount  
* Discount percentage  
* Tuition per credit  
* Annual estimated tuition or cost  
* Employer reimbursement estimate  
* Out-of-pocket cost estimate  
* Admission requirements  
* Benefits  
* Curriculum highlights  
* Terms and conditions  
* Optional concentrations  
* Application URL

### **Data Available but Not Always Shown**

The app may also have:

* Total tuition cost  
* Required credits  
* Annual tuition cost  
* Program keywords  
* Areas of study  
* Program stats  
* Brochure URLs  
* Accreditation badge  
* School address or location  
* School graduation rate  
* School website  
* Corporate partner reimbursement policy file  
* Corporate partner benefits  
* Tuition reimbursement provider URL  
* Concentration duration  
* Concentration modality  
* Pace options with annual cost and completion time

## **7\. Current Typography**

The app mainly uses **Lato** across the reviewed program surfaces.

Other fonts available in the app include:

* Lexend  
* Open Sans  
* Inter

### **Typography by Use**

| Text Type | Font | Size | Usage |
| ----- | ----- | ----- | ----- |
| Program List hero heading | Lato | 36px | Main page heading |
| Program List subtitle | Lato | 16px | Supporting page copy |
| Large title style | Lexend | 32px | App title style |
| Small title style | Lexend | 24px | Smaller title style |
| Program card title | Lato | \~21px | Program result cards |
| Drawer section heading | Lato | 16–18px | Drawer sections |
| Body copy | Lato | 16px | Drawer and modal copy |
| Metadata | Lato | 13–14px | Dates, tags, helper text |
| Button text | Lato | 14–16px | CTAs and modal buttons |
| Footnote/legal text | Lato | 12–14px | Cost notes and legal copy |

## **8\. Program List Typography**

### **Main Heading**

**Find the right program for your future**

Current treatment:

* Lato  
* 36px  
* 600 weight

### **Subtitle**

**Search thousands of programs from top universities and find the perfect fit**

Current treatment:

* Lato  
* 16px  
* 300 weight

### **Filter Labels**

Visible filter labels include:

* Degree Level  
* Course Modality  
* Areas of Study  
* Universities

Current treatment:

* Lato  
* Around 15px  
* Medium or bold weight

# 9\. Program Card Typography

Program cards use a clear card hierarchy.

### **Card Text Elements**

Cards may include:

* Discount badge text  
* Program title  
* School name  
* Application deadline  
* Start date  
* Location or modality  
* Tags  
* Explore program  
* Add to compare

### **Program Name**

Current treatment:

* Lato  
* Around 21px  
* 700 weight

### **Metadata**

Current treatment:

* Lato  
* 13–14px  
* 400–500 weight

### **Buttons**

Current treatment:

* Lato  
* 14–16px  
* 600–700 weight

# 10\. Drawer Typography

The drawer uses Lato for most visible text.

### **Drawer Text Elements**

The drawer includes:

* Discount badge  
* School name  
* Program name  
* Program headline  
* Primary CTA  
* Key fact labels  
* Key fact values  
* Section headings  
* Body copy  
* Read-more buttons  
* CTA card headings  
* CTA card descriptions

### **Visible Section Headings**

* About the Program  
* Admission Requirements  
* Benefits  
* Curriculum Highlights  
* Terms and Conditions  
* Take the Next Step

### **Read-More Buttons**

Visible read-more buttons include:

* View Full Program Details  
* View Full Admission Requirements  
* View Full Curriculum Highlights  
* View Full Terms & Conditions

# 11\. Apply Now Modal Typography

The modal includes:

* Modal title  
* Body copy  
* Scheduling link  
* Secondary button  
* Primary button

### **Visible Modal Text**

* Apply Now  
* Schedule Call with Education Benefits Specialist  
* Cancel  
* Apply Now

Body copy uses 16px gray text.

The scheduling link appears as blue link-style text.

