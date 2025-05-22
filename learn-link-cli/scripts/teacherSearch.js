let query = "Python";

const urlParams = new URLSearchParams(window.location.search);
const urlQuery = urlParams.get('q');

if (urlQuery) {
    query = urlQuery;
}

const teachersSection = document.getElementById("teachers-section");
const searchInput = document.getElementById("searchInput"); // No search input from skills dashboard

const loadSkillTeachers = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/skills/teachers?q=${query}`);
        const teacherData = await response.json();
        console.log(teacherData);

        // Create a Bootstrap row to contain the cards
        const cardRow = document.createElement("div");
        cardRow.classList.add("row", "g-4");


        teacherData.map( (t) => {
            // Create a column for each card (e.g., col-md-4 for 3 cards per row on medium screens)
            const cardColumn = document.createElement("div");
            cardColumn.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3");

            // Create the Bootstrap card container
            const teacherCard = document.createElement("div");
            teacherCard.classList.add("card", "h-100");
            teacherCard.setAttribute("teacher-item-id", t.user_id);

            // Create the card body
            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body", "text-center");
 
            // Teacher Image           
            const teacherImage = document.createElement("img");
            teacherImage.classList.add("card-img-top", "rounded-circle", "mx-auto", "d-block", "mt-3");
            teacherImage.setAttribute("src", "assets/profile-user.png");
            teacherImage.setAttribute("alt", `${t.first_name} ${t.last_name}`);
            teacherImage.style.width = "100px";
            teacherImage.style.height = "100px";
            teacherImage.style.objectFit = "cover";

            // Teacher Name
            const teacherName = document.createElement("h5");
            teacherName.classList.add("card-title", "name-subheader", "mt-3");
            teacherName.textContent = `${t.first_name} ${t.last_name}`;

            // Teacher Location
            const teacherLocation = document.createElement("p");
            teacherLocation.classList.add("card-text");
            teacherLocation.innerHTML = `<i class="bi bi-geo-alt-fill me-1"></i>${t.postcode}`;

            // Teacher Sessions
            const teacherSessions = document.createElement("p");
            teacherSessions.classList.add("card-text", "text-muted");
            teacherSessions.textContent = `Sessions taught: ${t.session_count}`;            
            
            // Details Button
            const detailsButton = document.createElement("a");
            detailsButton.classList.add("btn", "btn-primary", "mt-2");
            detailsButton.href = `user-profile.html?userId=${t.user_id}`;
            detailsButton.textContent = "See more details";

            // Append elements to card body
            cardBody.appendChild(teacherName);
            cardBody.appendChild(teacherLocation);
            cardBody.appendChild(teacherSessions);
            cardBody.appendChild(detailsButton);

            // Append image and card body to the card
            teacherCard.appendChild(teacherImage);
            teacherCard.appendChild(cardBody);

            // Append card to the column
            cardColumn.appendChild(teacherCard);

            // Append column to the row
            cardRow.appendChild(cardColumn);

        });

        // Append the row of cards to the teachers-section
        teachersSection.appendChild(cardRow);

    } catch (err) {
        console.log(err.message);
    }
}

loadSkillTeachers();