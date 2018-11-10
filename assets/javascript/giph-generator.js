// <!--------- THe code below will be adding dynamic functionality to the HTML ------------>

    // Initial array of cartoon show topics
    var topics = [
        "Big City Greens", "The Simpsons", "Bob's Burgers", "Spongebob Squarepants", "Adventure Time", "Family Guy",
        "The Loud House", "The Boondocks", "Gravity Falls", "Beavis and Butt-head", "Daria"
    ];

    // Generic function for capturing the cartoon show title from the data-attribute
    function alertCartoonShowName() {
        // var cartoonName = $(this).attr("data-name");

        // alert(cartoonName);
    }

    // Function for displaying cartoon data
    function renderButtons() {

        // Deleting the cartoons prior to adding new cartoon shows
        // (this is necessary otherwise we will have repeat buttons)
        $("#buttons-view").empty();

        // Looping through the array of cartoon titles
        for (var i = 0; i < topics.length; i++) {

            // Then dynamicaly generating buttons for each show in the array
            // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
            var a = $("<button>");
            // Adding a class of cartoon to our button
            a.addClass("cartoon");
            // Adding a data-attribute
            a.attr("data-name", topics[i]);
            // Providing the initial button text
            a.text(topics[i]);
            // Adding the button to the HTML
            $("#buttons-view").append(a);
        }
    }

    // This function handles events where one button is clicked
    $("#add-cartoon").on("click", function (event) {
        // Preventing the buttons default behavior when clicked (which is submitting a form)
        event.preventDefault();
        // This line grabs the input from the textbox
        var cartoon = $("#search-input").val().trim();

        // Adding the cartoon from the textbox to our array
        topics.push(cartoon);
        $("#search-input").val("");
        // Calling renderButtons which handles the processing of our topics array
        renderButtons();

    });

    // Function for displaying the cartoon show info
    // We're adding a click event listener to all elements with the class "cartoon"
    // We're adding the event listener to the document because it will work for dynamically generated elements
    // $(".cartoon").on("click") will only add listeners to elements that are on the page at that time
    $(document).on("click", ".cartoon", alertCartoonShowName);

    // Calling the renderButtons function to display the intial buttons
    renderButtons();

    // Event listener for all button elements
    $(document).on("click", "button", function (event) {
        // In this case, the "this" keyword refers to the button that was clicked
        event.preventDefault();
        $("#gifs-appear-here").empty();
        var cartoonName = $(this).attr("data-name");
        console.log(cartoonName);

        // Constructing a URL to search Giphy for the cartoon name, ratings, and search result limit
        var limit = 10;
        var rating = "PG-13";
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + cartoonName
            + "&api_key=tiF3QKs3vg5cSMISU83cRJztnLko4jdd&limit=" + limit;

        // Performing our AJAX GET request
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            // After the data comes back from the API
            .then(function (response) {
                // Storing an array of results in the results variable
                var results = response.data;

                // Looping over every result item
                for (var i = 0; i < results.length; i++) {

                    // Only taking action if the photo has an appropriate rating
                    if (results[i].rating <= "pg-13") {
                        // Creating a div for the gif
                        var gifDiv = $("<div>");

                        // Storing the result item's rating
                        var rating = results[i].rating.toUpperCase();

                        // Creating a paragraph tag with the result item's rating
                        var p = $("<p>").text("Rating: " + rating);

                        // Storing the result item's file name
                        var gifTitle = results[i].title.toUpperCase();

                        // Creating a h6 tag with the result item's file name
                        var h6 = $("<h6>").text(gifTitle);

                        // Creating an image tag
                        var gifImage = $("<img>");

                        // Giving the image tag an src attribute of a property pulled off of the
                        // result item
                        gifImage.attr("src", results[i].images.fixed_height_still.url);
                        gifImage.attr("still", results[i].images.fixed_height_still.url);
                        gifImage.attr("class", "gifImage");
                        gifImage.attr("animated", results[i].images.fixed_width.url);

                        // Appending the gifImage and paragraph we created to the "gifDiv" div we created

                        gifDiv.append(gifImage);
                        gifDiv.append(p);
                        gifDiv.append(h6);

                        // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
                        $("#gifs-appear-here").prepend(gifDiv);
                    }
                }
                // Make still images become animated with on.click
                $(".gifImage").on("click",function (event) {
                    // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
                    var state = $(this).attr("data-state");
                    // If the clicked image's state is still, update its src attribute to what its data-animate value is.
                    // Then, set the image's data-state to animate
                    // Else set src to the data-still value
                    if (state === "still") {
                        $(this).attr("src", $(this).attr("animated"));
                        $(this).attr("data-state", "animated");
                    } else {
                        $(this).attr("src", $(this).attr("still"));
                        $(this).attr("data-state", "still");
                    }

                })
            });


    });
