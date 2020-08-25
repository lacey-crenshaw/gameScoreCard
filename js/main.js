async function getCourses() {
    fetch('https://golf-courses-api.herokuapp.com/courses').then((response) => {
        response.json().then((data) => {
            const courses = data.courses;
            let courseOptions = '';
            courses.forEach((course) => {
                courseOptions += `<option value="${course.id}">${course.name}</option>`;
            });
            document.getElementById('course-select').innerHTML = courseOptions;
            const id = courses[0].id
            getCourse(id);
        });
    });
}


async function getCourse(id) {
    fetch(`https://golf-courses-api.herokuapp.com/courses/${id}`).then(
        (response) => {
            response.json().then((data) => {
                const course = data.data;
                document.getElementById('course-info').innerHTML = `
      <h3 class="center-text">${course.name}</h3>
      <img class="thumbnail" src="${course.thumbnail}">
      `;
                const holes = course.holes;

                var num = 0
                function increment() {
                    num++
                    return num
                }

                document.getElementById("tee-select").addEventListener("change", function () {
                    var teeBox = this.options[this.selectedIndex].value;
                    console.log(teeBox)
                    let holesHtml = ''
                    holes.forEach(hole => {
                        holesHtml +=
                            `<div id="${num}">
        <p class="table">${increment()}</p>
        <p id="yards" class="table">${hole.teeBoxes[teeBox].yards}</p>
        <p id="par" class="table">${hole.teeBoxes[teeBox].par}</p>
        <p id="hcp" class="table">${hole.teeBoxes[teeBox].hcp}</p>
        </div>`
                    })
                    document.getElementById('holes').innerHTML = holesHtml;

                    let parOut = holes.filter(val => val.hole < 10).reduce((acc, val) => { return acc += val.teeBoxes[0].par }, 0)
                    parIn = holes.filter(val => val.hole >= 10).reduce((acc, val) => { return acc += val.teeBoxes[0].par }, 0)
                    parTot = parIn + parOut
                    yardOut = holes.filter(val => val.hole < 10).reduce((acc, val) => { return acc += val.teeBoxes[0].yards }, 0)
                    yardIn = holes.filter(val => val.hole >= 10).reduce((acc, val) => { return acc += val.teeBoxes[0].yards }, 0)
                    yardTot = yardOut + yardIn

                    $("#8").after(`<div id="out"><p class="table-out">OUT</p><p class="table-out">${yardOut}</p><p class="table-out">${parOut}</p><p class="table-out">*</p></div>`)
                    $("#17").after(`<div id="in"><p class="table-out">IN</p><p class="table-out">${yardIn}</p><p class="table-out">${parIn}</p><p class="table-out">*</p></div>`)
                    $("#in").after(`<div id="total"><p class="table-out">TOT</p><p class="table-out">${yardTot}</p><p class="table-out">${parTot}</p><p class="table-out">*</p></div>`)
                })
            });
        }
    );
}

function players() {
    document.getElementById("player-select").addEventListener("change", function () {
        var numplayers = this.options[this.selectedIndex].value;

        for (var pl = 1; pl <= numplayers; pl++) {
            $(".playerlist").append(`<input id='player${pl}' class='table'>`);
            $("#out").append(`<input placeholder="0" id='outScore' class='table'>`)
            $("#total").append(`<input placeholder="0" id='totalScore' class='table'>`)
            $("#in").append(`<input placeholder="0" id='inScore' class='table'>`)
        };
        for (var h = 0; h <= 17; h++) {
            for (var p = 1; p <= numplayers; p++) {
                $("#" + h).append(`<input id='hole${h}player${p}' class='table'>`);
            }
        }
    })
}



players();
getCourses();
