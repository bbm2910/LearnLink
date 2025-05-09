## Weeks 8-9 - Multidisciplinary Project - Bevan

You will be working in teams to identify, design and implement a tech solution for a problem or opportunity of your choosing.

> :exclamation: There's a lot of information on this page but it's all nested to _(hopefully)_ ease navigation! \
> :bulb: Wherever you find a `▶️` symbol, click it to reveal more details!

- [Deliverables](#deliverables)
- [Timeline Touchpoints](#timeline-touchpoints)
- [Requirements & Guidelines](#requirements--guidelines)
- [Scope](#scope)
  - [Constants](#constants) 
  - [Variables](#variables) 
- [Additional Resources](#additional-resources)

## Deliverables

<details>
<summary><bold>Business Case</bold></summary>


- Utilise the satasets available and research a relevant topic to form a Business Case to outline your problem and solution.
- :bulb: _See [Variables > Problem Statement](#variables) for more guidance on choosing a topic area._


</details>

<details>
<summary>Planning & research documents as appropriate</summary>

- Examples to consider include but are not limited to: 
  - Architecture diagram
  - Database schema diagram (ERD)
  - User stories
  - Wireframes
- :bulb: _Consider including these in your [pitch](#requirements--guidelines) and/or an appendix on your [presentation](#requirements--guidelines) slide deck._

</details>

<details>
<summary>Functional MVP of your solution.</summary>

_See [Variables > MVP](#variables) for more guidance on scope._

</details>

<details>
<summary>Supporting end-user documentation</summary>

- Examples to consider include but are not limited to:
  - Styleguide
  - API documentation
  - Getting Started guide
- These are ideal to enhance a project README
- Tell us about this type of content in your presentation too! 
    - Consider adding links to share with the audience and/or to an appendix on your [presentation](#presentation-requirements) slide deck.

</details>

<details>
<summary>Presentation</summary>

_See [Constants > Presentation Preparation](#constants) for info on presentation rehearsals & the main event!_ \
_See [Requirements & Guidelines > Presentation Requirements](#requirements--guidelines) for presentation requirements._

</details>

---

## Timeline Touchpoints

### Week 1
| | Monday |  Friday |
| -- | -- | -- |
| AM | Finalise planning & Pitches _(see <a href="#requirements--guidelines">Requirements & Guidance > Pitch Requirements</a>)_ | |
| PM | Start Development | Full team retro |

### Week 2
| | Wednesday | Thursday | Friday |
| -- | -- | -- | -- | 
| AM | | Halt code & merge to main + 1st Dry Runs | 2nd Dry Runs |
| PM | Feature Freeze*** | Implement 1st Dry Run feedback | Presentations _(see <a href="#requirements--guidelines">Requirements & Guidance > Presentation Requirements</a>)_ |

<p id="#feature-freeze"> *** <sub><i>This means that no new feature can be started after this time. Existing features can be finished, refactored or fixed.</sub></i></p>


---

## Requirements & Guidelines

<table>

<tr>
<td><details>
<summary>Technical Guidelines</summary>

- Use version control & work in an Agile manner!
- Your repos should have excellent READMEs. See our [Writing READMEs guide](https://github.com/getfutureproof/fp_guides_wiki/wiki/Writing-READMEs) for details.
- Your work should make good use of the concepts we have covered on the course. This **includes** concepts from Deep-Dives:
	
	| Deep-Dive | Concepts |
	| -- | -- | 
	| CDO | Containerisation using Docker + Implementation of Microservices |
	| Data | Use of Data Analytics + Visualisation Principles |
	
- Your app should be deployed and you should aim for test coverage of at least 80%

</details></td>
</tr>

<tr>
<td><details>
<summary>Pitch Requirements</summary>

_Pitches take place on the Monday morning of Week 1._

- Put together your own brief as a document of what you are working towards. This should include:
    - Problem Statement & solution
    - A stakeholder & risk analysis
    - Product/service [USP](https://en.wikipedia.org/wiki/Unique_selling_proposition)
    - MVP Requirements _(Must haves and should haves)_
    - Initial Wireframes  
    - Stretch Goals _(Could haves)_ 
    - Technologies
    - DevOps Architecture Diagram 
 
- Prepare a 5-8 minute pitch presentation covering the topics in your brief.
    - This will be presented to your trainers only, not the full cohort.
    - It is strongly encouraged to also use tools to illustrate your ideas (wireframes, database schemas, etc.).

- You may be asked to revise the plan slightly to fit the timescale but otherwise will receive sign-off following the pitch.

</details></td>
</tr>

<tr>
<td><details>
<summary>Presentation Requirements</summary>

Prepare a 10-12 minute presentation to include the following topics.

> :exclamation: You are unlikely to have time to include all the recommended details in the presentation but be prepared to take further questions on these topics.

<table>

<tr>
<td><details>
<summary>Solution Research & Planning</summary>

- Give an overview including:
    + Problem statement
    + Intended solution outcome(s)
- Show how you planned out your work after initial research and solution definition.
- Documents could include _(in core presentation and/or within deck appendix for use during Q&A)_:
    + Stakeholder and Risk Analysis
    + Decision Matrix
    + Data Analysis
    + Process / Data Flow Diagrams (if relevant)

</details></td>
</tr>

<tr>
<td><details>
<summary>Planning & Delivery</summary>

- Show us how you approached team & project management.
- Documents could include
    + Wireframes
    + Database schema diagram (ERD)
    + Trello board and user research
    + Architecture diagram
- Topics may include:
    - Working methodology
    - Agile collaboration tools
    - Team roles
    - Team playbook
    - Design approach 
    - Infrastructure/automation highlights _eg. a GitHub action you implemented to assist with smooth delivery_

</details></td>
</tr>

<tr>
<td><details>
<summary>MVP Demonstration</summary>

- Please provide pre-recorded videos of your solution in action.
- Recording tips to consider:
    + Learn your 'choreography'!
    + Have form content ready to copy and paste.
    + Use realistic data! No `testuser`s or `dummy post content blah blah blah`!
    + Close your 64 browser tabs!
    + Hide your browser bookmark bar.
- Editing tips to consider:
    + Speed up 'boring' bits eg. filling in a form.
    + If showing a multi-users interaction:
        + Use side-by-side or picture-in-picture layouts.
        + Add overlay text clearly indicating user role.
    + Add open captions if appropriate to describe audio elements within the demo recording eg.
        + a system alert
        + a text-to-speech feature
        + music
        + :warning: _**NB:** you will provide **live** narration of your demo video, please do not add your narration captions to your video as these will be auto-generated during the live presentations._
- See our [guidelines for recording video demos](https://gist.github.com/getfutureproof-admin/64b01dc8316eb682e1026b5b443bf590) for more tips!

</details></td>
</tr>


<td><details>
<summary>Tools & Technologies</summary>

- Show us the key tools & technologies that went into your solution, particularly those that are pertinent to your Deep Dives.
- Don't be exhaustive or redundant. This is not an exact science but use good judgement eg.
    + :white-check-mark: Nodejs
    + :white-check-mark: Nodejs, ExpressJS
    + :x: NodeJS, ExpressJS, body-parser, CORS
- Make sure you can confidently and accurately distinguish between your used:
    + languages
    + frameworks
    + libraries
    + concepts

</details>

<tr>
<td><details>
<summary>Significant Wins</summary>

- Show us two aspects of the project you're proud of and/or your solution couldn't work without! 
- You can include
  + snippets of code
  + change documents
  + data dashboards or visualisations
  + microservices 

</details></td>
</tr>

<tr>

<tr>
<td><details>
<summary>Challenges and Solutions</summary>

- **Be specific!**
- These are **not** challenges / solutions:
    + "time"
    + "Redux"
- These could be though!
    + "Illness in the team meant we had to review our original time management plan."
    + "Everything broke on day 4! We realised that an update with a breaking change had been made to React Router overnight and we had not set a specific version requirement in our `package.json`."

</details></td>
</tr>

<tr>
<td><details>
<summary>Future Features</summary>

- Which additional feature might we implement first and why?
- Consider the following for each feature:
    + What tools might we use to implement this feature?
    + What challenges might we anticipate around this feature?

</details></td>
</tr>

</table>

<br />

**Q&A** \
Immediately after your presentation, there will be a 5-10 minute Q&A facilitated by the event host _(a futureproof staff member)_.
- During this Q&A aim to give space for each person on your team to speak.
- You may like to prepare an appendix to your presentation deck to reference as appropriate during Q&A.

***See our [Presentation Guide](https://gist.github.com/getfutureproof-admin/8858ae4a2e9ef624422b0ed502d9332d) for tips*** 

</td>
</tr>

</table>

---

## Scope
If this brief seems wide, it's because it is!

There are some specifics [_("Constants")_](#constants) however, so start with those to get your bearings and let that be the leaping off point for the free-reign elements [_("Variables")_](#variables)!

### Constants 
> :question: _"non-negotiable specifics"_ \
> Elements of the project that are either completely set in stone or have clear constraints. \
> Embrace these because, as many people note, [Constraints can make you more Creative](https://buffer.com/resources/7-examples-of-how-creative-constraints-can-lead-to-amazing-work/)!

<table>


<tr>
<td><details>
<summary>Time</summary>

_This is a 2 -week project with certain dictated touchpoints across that period. Take time to take in the AM/PM [Timeline Touchpoints](#timeline-touchpoints) below. Exact times will be shared by your trainers as appropriate. Please do reach out to them if you're not sure on anything related to the timeline._

</details></td>
</tr>

<tr>


<td><details>
<summary>Team</summary>

_You will be working in teams of 4-6 people, assigned by your trainers._

</details></td>
</tr>

<tr>

<td><details>
<summary>Standup</summary>

_Each team will have:_

<table>
<tr>

<td><details>
<summary><i>A daily stand-up (except Fridays & weekend)</i></summary>

- Times selected from trainer-provided options.
- Teams & trainers commit to:
    - holding stand-up at the same time each day of the project.
    - clearly communicating any absolutely essential absence from stand-up to all team members & trainers.
- At least one of your trainers will attend and share any important updates/feedback.
- Checkout [Agility's guide to daily stand-ups](https://agility.im/frequent-agile-question/what-is-a-daily-stand-up/) for a refresher/inspiration on how to run an effective stand-up.
- Your attending trainer **is not your Scrum Master**! Please facilitate these stand-ups yourselves!
- It's not required but most trainers usually like to be invited to join in so if time allows, do popcorn over to them as well!

</details></td>
</tr>

<tr>

</tr>
</table>

</details></td>
</tr>


<tr>

<td><details>
<summary>Presentation Preparation</summary>

Each team will have 2 'dry runs' before the final 'demo day' event. Please read these preparation guidelines:

<table>
<tr>

<td><details>
<summary>For both dry runs...</summary>

- Team time slots will be assigned and shared at least one day in advance.
- Please be ready in the waiting room a bit before your assigned time and we will let you in as soon as we are ready.
- Be prepared to give your presentation at whatever stage it is at. _(See the specific preparation requirements below)_
- Your trainers will attend and facilitate.
- All Academy staff are invited to drop in as their schedule allows though, so don't be surprised if other faces appear/disappear! 
- Honest feedback on presentation content & delivery will be given by trainers and other attending staff.
- If you drastically run over the 10-12 minute time guide, we will need to stop and give feedback based on the content we have seen up until that point.
- **These are not technical Q&A or debug sessions!**

</details></td>

</tr>

<tr>

<td><details>
<summary><i>1st Dry Run (Week 2 Thursday AM)</i></summary>

- Preparation Requirements:
	- Presentation outline _(order of content & speakers)_
	- Your slide deck _(it's okay if a few details are missing/undecided at this point)_
	- A rough draft of your demo video 
		- _We all know this is going to get re-recorded, probably several times._
		- _Nobody will be worrying that your product/service looks ugly/is unfinished/is broken at this point._
		- _The important thing is to have a video file to play, with key visual moments, to practice reading your voiceover - it's not as easy as it might sound!_
- A member of your team will run the slide deck.
- Aim to run the timings & handovers as planned, even if the content is not yet complete.
- Any required or suggested changes will be given by trainers.

</details></td>
</tr>

<tr>

<td><details>
<summary><i>2nd Dry Run/Final Rehearsal (Week 2 Friday AM)</i></summary>

- Preparation Requirements:
	- Materials to be shared with trainers at least 1 hour in advance: 
		- Slide deck
		- Cue sheet
		- Demo recording _(Please provide separately, even if you have embedded it into your deck)_
	- _NB: Materials should be submitted as complete. Small adjustments can be made after 2nd dry run but we aim to keep them to a minimum!)_
- An Academy staff member will share their screen and run the slide deck. _(Likely one of your trainers)_
	- This is their rehearsal as well as yours so make sure you practice giving the cues that are in your cue sheet!
- Run the presentation as if in the 'real thing'.
	- That means professional delivery mode - if you wouldn't do it when presenting to a client, don't do it in your dry run!
	- The Academy staff member running the deck may pause to clarify a significantly problematic cue or technical requirement but will aim to follow you through any mishaps and save questions/clarifications for after the run.

</details></td>

</tr>
</table>


</details></td>
</tr>

<tr>


<td><details>
<summary>Demo Day Event (Presentations!)</summary>

This project's presentations will be delivered as the main event in your cohort's Demo Day! The demo day is an opportunity for you and your trainers to celebrate and share your amazing progress! 

<table>

<tr>
<td><details>
<summary>People Involved</summary>

These events are hosted by a senior member of Academy staff - there's a slight chance that the host will be someone you've not had as much chance to get to know yet. They always aim to come to the rehearsals and I promise we're all very friendly and inordinately proud of you even if you don't know it yet!

These events are open to clients and all Academy staff so you **_might_** see
- A larger audience than previous presentations
- New faces and names
- Some familiar and unfamiliar company names

</details></td>
</tr>

<tr>
<td><details>
<summary>Sample running order</summary>

The running order will be confirmed by your trainers in advance but an **example** running order for an event with 3 presenting teams could look like:

| | |
| --- | --- |
| 2.30pm | All teams & trainers gather in event room link |
| 2.35pm | Tech check _(your mics & cameras, host's mic & camera, slide deck screen share, any other media)_ |
| 2.50pm | Pre-game wiggle/breathe/bathroom! |
| 3.00pm | Room opened to public |
| 3.03pm | Host: Welcome & housekeeping |
| 3.05pm | Host: Course overview & cohort introduction |
| 3.10pm | Team 1: Presentation |
| 3.25pm | Team 1: Q&A _(moderated by host)_ |
| 3.30pm | Team 2: Presentation |
| 3.45pm | Team 2: Q&A _(moderated by host)_ |
| 3.50pm | Team 3: Presentation |
| 4.05pm | Team 3: Q&A _(moderated by host)_ |
| 4.15pm | Host: Wrap up |
| 4.20pm | END |

</details></td>
</tr>

</table>

See [Requirements & Guidelines > Presentation Requirements](#requirements--guidelines) for full details on presentation requirements.

</details></td>
</tr>

</table>



### Variables
> :question: _"aspects with space for interpretation & free-rein thinking_" \
> Are you ready for the unrestrained, unbridled creative parts? \
> _If not, don't worry, it's true that a blank page can feel super scary, so whilst we encourage you to bring your full creative selves to this, we've added some thought prompts below that you are very welcome to use as jumping off points!_

<table>

<tr>

<td><details>
<summary>Business Case</summary>

Coming up with an idea is hard! As humans we're pretty good at finding problems though :wink: so let's use that to our advantage!

If you have secured a placement, you might also want to 'theme' your project around a particular industry so you can start to think about that space.

Remember, your Business Case will need to be supported by a range of appendices to back up your problem and solution. You can draw on as many of these as you wish. We would suggest:

- Stakeholder and Risk Analysis
- Decision Matrix
- Data Analysis
- Process / Data Flow Diagrams (if relevant)

</details></td>
</tr>


<tr>
<td><details>
<summary>Solution</summary>

You've already experienced outlining, analysing & selecting a solution so we're fully on board with you to take this one from here!

See [Requirements & Guidelines > Technical Guidelines](#requirements--guidelines) for some points to bear in mind

</details></td>
</tr>


<tr>

<td><details>
<summary>MVP</summary>

Your MVP will need to include:
- An API as a microservice
- A database as a microservice
- A frontend application

You are welcome to implement the use of new tools such as **AI**.

Remember, **many clients** use certain tools across their organisation. It's not compulsory (and won't always be relevant), but we'd advise that you used these technologies in your project where you can:
- Python
- AWS
- Power BI
- databricks

_The below is a **suggested** outline of how tasks should be divided across the members of your team and their specialisations_

| Specialism | Tasks |
| -- | -- | 
| CDO | Implement API + Containerisation + Microservices + S3 Bucket Reporting + Lead Developer Backend |
| Data | Support PM in Business Case + Implement Database + Connection to API + Data Cycle (S3 Bucket?) + Data Visuals + Supporting Developer Backend |
| *Assigned PM* | Lead Project using Agile + Support wider development |
| All | Implementation Testing + Frontend Development |

_Cross collaboration in this project is vital and the ability to quickly understand the specialisms that the members of your team can bring to the project will be of significant benefit._

See [Requirements & Guidelines > Technical Guidelines](#requirements--guidelines) for some points to bear in mind.

</details></td>
</tr>


</table>

---

## Additional Resources

- [Tips for working in small-group projects](https://gist.github.com/getfutureproof-admin/fbbefeccf62cb3e120adae8d20a2ac56)
