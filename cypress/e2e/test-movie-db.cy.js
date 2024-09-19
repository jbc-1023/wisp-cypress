/*-- Selectors that can be globally referenced for convienence------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------*/
let selectors = {
    "input"                : '[aria-label="Search terms"]',
    "search_result"        : '[data-cy="searchResult"]',
    "search_results_title" : '[data-cy="results_title"]',
    "ratings_release"      : '[class="list-group-flush list-group"]',
    "submit"               : '[data-cy="submitSearch"]',
    "suggestions"          : '[data-cy="autoResults"]',
    "rating"               : '[class="list-group-item"]',
    "page"                 : '.page-item'
};

/*-- Visual check on the elements as page loads ---------------------------------------------------------------------
✅ Title
✅ Input box
--------------------------------------------------------------------------------------------------------------------*/
describe('Page elements', { tags: ['regression'] }, () => {
    beforeEach(() => {
        cy.visit('/');  // Base URL. Configure in cypress.config.ts
    });

    /*-- Verify the title upon landing the page -----------------------------------------------------------------------
    ✅ Tag
    ✅ Style
    ✅ Text
    ✅ Visibility
    -----------------------------------------------------------------------------------------------------------------*/
    it('Title', { tags: ['smoke'] }, () => {
        let selector = '[data-cy="page-title"]';

        // ✅ Tag
        cy.get(selector)
            .should('have.prop', 'tagName')                      
            .then((tagName) => {expect(tagName).to.equal('H1');})  

        cy.get(selector)
            // ✅ Style
            .should('have.css', 'color', Cypress.env('cssAlias')["--bs-body-color-rgb"])
            // ✅ Text
            .should('contain.text', 'Welcome to Movie Search')     
            // ✅ Visibility
            .should('be.visible');                                 
    });

    /*-- Verify the text input box upon landing the page --------------------------------------------------------------
    ✅ Tag
    ✅ Style
    ✅ Placeholder text
    ✅ Visibility
    -----------------------------------------------------------------------------------------------------------------*/
    it('Text input box', { tags: ['smoke'] }, () => {
        let selector = '[aria-label="Search terms"]';
        // ✅ Tag
        cy.get(selector)
            .should('have.prop', 'tagName')
            .then((tagName) => {expect(tagName).to.equal('INPUT')});
        
        cy.get(selector)
            // ✅ Style
            .should('have.css', 'color', Cypress.env('cssAlias')["--bs-body-color-rgb"])
            // ✅ Input text
            .should('have.attr', 'placeholder', 'Search terms')
            // ✅ Input visibility
            .should('be.visible');   
    });

    /*-- Verify the input button upon landing the page -----------------------------------------------------------------
    ✅ Button style
    ✅ Button text
    ✅ Button visibility
    -------------------------------------------------------------------------------------------------------------------*/
    it('Submit button', { tags: ['smoke'] }, () => {
        let selector = '[data-cy="submitSearch"]';

        // ✅ Button style
        cy.get(selector)
            .should('have.prop', 'tagName')
            .then((tagName) => {expect(tagName).to.equal('BUTTON')});
        
        cy.get(selector)
            // ✅ Button text
            .should('contain.text', 'Search')   
            // ✅ Button visibility
            .should('be.visible');   
    });

    /*-- Verify results does not show -----------------------------------------------------------------------------------
    ✅ Seach results text do not show
    -------------------------------------------------------------------------------------------------------------------*/
    it('No results showing', { tags: ['smoke'] }, () => {
        
        // Search results list
        const touch_points = [
            "Results",
            "Rating",
            "Release Date"
        ]
        
        // ✅ Text do not show
        touch_points.forEach((value) => {
            cy.contains(value).should('not.exist');
        });
    })
});

/*-- Search feature-------------------------------------------------------------------------------
✅ Search with enter keyboard and mouse click
✅ Instant suggestion while typing
✅ Max and min number of suggestion
✅ Select from suggestion with keyboard and mouse click
✅ Send max char length to input
✅ Pagination
--------------------------------------------------------------------------------------------------------------------*/
describe('Search', { tags: ['regression', 'search'] }, () => {
    beforeEach(() => {
        cy.visit('/');  // Base URL. Configure in cypress.config.ts
    });

    /*-- Verify a search with enter key ---------------------------------------------------------------------------------
    ✅ Search, with enter key, for movie "Legally Blonde" and get a result with expected framing
    ✅ Verify result poster image is not broken link
    ✅ Verify the title is shown
    ✅ Verify the description is 50 words or less
    -------------------------------------------------------------------------------------------------------------------*/
    it('Search a movie with enter key', { tags: ['smoke'] }, () => {
        let search_term = "Legally Blonde";
        
        // ✅ Search for movie "Legally Blonde" and get a result with expected framing
        // Type search term, with delay to simulate more human-like
        cy.get(selectors["input"]).type(`${search_term}{enter}`, { delay: 300 });

        // ✅ Verify search result title text and visibility
        cy.get(selectors['search_results_title'])
            .should('contain.text', 'Results')     
            .should('be.visible');

        // ✅ Verify results image element
        cy.get(selectors['search_result']).find("img")
            .should('have.attr', 'alt', `Poster for ${search_term}`)   // Alt text
            .invoke("attr", "src")                                     // Verify image url exists
            .should("not.be.empty");

        // ✅ Verify image is not broken link
        cy.get(selectors['search_result']).find("img")
            .invoke('attr', 'src')
            .then((imageUrl) => {
                cy.request(imageUrl)
                    .its('status')
                    .should('eq', 200);
            });

        // ✅ Verify structure and content labels
        const touch_points = [
            search_term,
            "Rating:",
            "Release Date:"
        ];
        touch_points.forEach((value) => {
            cy.get(selectors['search_result']).contains(value);
        });

        // ✅ Verify content is not empty
        cy.get(selectors['search_result']).find("p")        // Description
            .should('have.attr', 'class', "card-text")
            .should("not.be.empty");
        cy.get(selectors['ratings_release'])                // Ratings and release
            .should('have.length', 6);

        // ✅ Verify content's first 50 words is visible
        let max_words = 50;
        cy.get(selectors['search_result']).find("p").first().invoke("text")
            .then((text) => {
                // Is 50 words
                let words_visible = text.trim().split(/\s+/);
                expect(words_visible.length).to.be.lte(max_words);

                // 50 words is visible
                cy.contains(text).should('be.visible');
            });

        // ✅ Verify rating and stars
        cy.get(selectors['rating']).first().invoke("text")
            .then((text) => {
                // Regex the format.  Rating <number> (by <number> raters)
                const regex = /Rating:\s*\d+(\.\d+)?\s*\(by\s*\d+\s*raters\)/;
                expect(regex.test(text)).to.equal(true);
            });

        // ✅ Verify date format to be month day year
        cy.get(selectors['rating']).eq(1).invoke("text")  // Second instance
            .then((text) => {
                // Match the general format for date
                let regex = /^Release Date: ([A-Z][a-z]{2}) (\d{1,2}), (\d{4})$/;
                expect(regex.test(text)).to.equal(true);
                
                // Match specifics
                regex = /^Release Date: (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2}), (\d{4})$/;
                const match = text.match(regex);

                // ✅ Verify month format
                const month = match[1];        // Don't need this, just having it in case needed later
                expect(match).to.be.ok;

                // ✅ Verify year is within sane range
                const year = parseInt(match[3], 10);
                expect(year).to.gt(1800);  // I don't think any movie exists before 1800. First movie from ChatGPT says 1888.
                expect(year).to.lt(2300);  // Let my AI humanoid copy know if this breaks by 2300 and it'll fix it asap.
        
                // ✅ Verify date format
                const day = parseInt(match[2], 10);
                const isValidDay = day >= 1 && day <= 31;  // A different way to do a range compare.
                expect(isValidDay).to.equal(true);
            });
    
    });

    /*-- Verify a search with clicking search button --------------------------------------------------------------------
    ✅ Search, with clicking search button, for movie "Legally Blonde" and get a result with expected framing
    -------------------------------------------------------------------------------------------------------------------*/
    it("Search a movie with search button click", { tags: ['smoke'] }, () => {
        let search_term = "Legally Blonde";

        // ✅ Search for movie "Legally Blonde" and get a result with expected framing
        // Type search term, with delay to simulate more human-like
        cy.get(selectors["input"]).type(search_term, { delay: 300 });

        // Click submit button
        cy.get(selectors['submit']).click();

        // Clear the text input so that search term only appears once on screen
        cy.get(selectors["input"]).clear();

        // ✅ Verify results are seen
        const touch_points = [
            search_term,
            "Rating:",
            "Release Date:"
        ];
        touch_points.forEach((value) => {
            cy.get(selectors['search_result']).contains(value);
        });

    });

    /*-- Verify suggestions appear while typing --------------------------------------------------------------------
    ✅ Suggestions don't show when no text is entered
    ✅ Suggestions do show when text is entered
    ✅ Suggestions don't show again when text is cleared
    -------------------------------------------------------------------------------------------------------------------*/
    it("Instant suggestion while typing", { tags: ['smoke'] }, () => {
        let search_term = "Legally Blonde";

        // ✅ Suggestion not showing with no text
        cy.get(selectors['suggestions']).should('not.exist');

        // Type a char
        cy.get(selectors["input"]).type("L");

        // ✅ Suggestion shows when there's text
        cy.get(selectors['suggestions']).should('exist');

        // Type a char
        cy.get(selectors["input"]).clear();

        // ✅ Suggestion not showing with no text
        cy.get(selectors['suggestions']).should('not.exist');
    });

    /*-- Verify max amount of suggestions and no suggestions --------------------------------------------------------------------
    ✅ Shows the max and min number of suggestions
    -------------------------------------------------------------------------------------------------------------------*/
    it("Max and none suggestions", { tags: ['boundary', 'error_handling'] }, () => {
        let suggestion_max = 5;

        // Type a char that should have more than max suggestions
        cy.get(selectors["input"]).type("L");

        // ✅ Verify showing the max number of suggestions
        cy.get(selectors['suggestions']).find("button")
            .should('have.length', suggestion_max);

        // Type a char string that's too weird to be a title
        cy.get(selectors["input"]).type("ooooongTitleThatThereShouldNotBeSuggestions", { delay: 200 });

        // ✅ Verify showing the max number of suggestions
        cy.get(selectors['suggestions']).should('not.exist');
    });

    /*-- Verify can select from suggestions by click ------------------------------------------------------------------------
    ✅ Type a query but select an entry by clicking from the suggestion that isn't exact match to the movie
    -------------------------------------------------------------------------------------------------------------------*/
    it("Select from suggestion with mouse click", { tags: ['smoke'] }, () => {
        let search_term1 = "Legally Blonde";
        let search_term2 = "Legally Blonde 2";
        let final_title = "Legally Blonde 2: Red, White & Blonde";

        // ✅ Search for movie "Legally Blonde" and select Lebally Blonde 2
        cy.get(selectors["input"]).type(search_term1, { delay: 300 });

        // ✅ Verify can select from suggestion
        cy.contains("button", search_term2).click();
        cy.contains("div", final_title).should("be.visible");
    });

    /*-- Verify can select from suggestions by keyboard -----------------------------------------------------------------------
    ✅ Type a query but select an entry by keyboard from the suggestion that isn't exact match to the movie
    -------------------------------------------------------------------------------------------------------------------*/
    it("Select from suggestion with keyboard", { tags: ['smoke', 'bug'] }, () => {
        // This can be a usibility bug where can't use arrow keys to select from suggestions.
        // Tabs is possible but that's a blunt method that's too generic.  
        expect(true).to.equal("This is a possible bug, check comment.");
    });

    /*-- Verify max input length doesn't cause issue with BE -----------------------------------------------------------
    ✅ Type a query that's max allowed char length into the input 
    -------------------------------------------------------------------------------------------------------------------*/
    it("Send max char length to input", { tags: ['boundary', 'bug'] }, () => {
        // There is no max length. There should be one for good practice.
        expect(true).to.equal("This is a possible bug, check comment.");
    });

    /*-- Verify pagination of past x per page ----------------------------------------------------------------------------
    ✅ Search a title that exists in many pages and verify pagination of x results per page
    ✅ Next page can be seen
    -------------------------------------------------------------------------------------------------------------------*/
    it("Pagination of x per page", { tags: ['bug'] }, () => {
        let search_term = "the";  // A word that must exist in more than x movies
        let max_per_page = 20;

        // Search for movie term and get a result
        // Type search term, with delay to simulate more human-like
        cy.get(selectors["input"]).type(`${search_term}{enter}`, { delay: 300 });

        // ✅ Verify there are 20 results shown
        cy.get(selectors['search_result'])
            .should('have.length', max_per_page);

        // Save a few current results to verify page has turned later
        let touch_points = []                  // Where to save the titles of this page
        for (let i=0; i<max_per_page-1; i++){  // Get the titles
            cy.get(selectors['search_result']).eq(i)
            .find("div.card-title")
            .invoke("text")
            .then((text) => {
                touch_points.push(text);
            });
        };

        // Scroll to bottom of page
        cy.scrollTo('bottom');

        // ✅ Verify page numbers
        for (let i=0; i<4; i++){  // Just verify 5 pages
            cy.get(`${selectors['page']}`).eq(i).invoke("text").then((text) => {
                if (i == 0){      // Page 1 is current
                    expect(text).to.equal(`${i+1}(current)`);
                } else {
                    expect(text).to.equal(`${i+1}`);
                }
            });
        };

        // Go to page 2
        cy.get(selectors['page']).eq(1).click();
        cy.wait(1000);  // Give it a sec for load. Possibly can make this less hard coded if this starts flaking.

        // Scroll to bottom of page
        cy.scrollTo('bottom');

        // ✅ Verify now on page 2
        for (let i=0; i<4; i++){  // Just verfy 5 pages
            cy.get(`${selectors['page']}`).eq(i).invoke("text").then((text) => {
                if (i == 1){      // Page 2 is current
                    expect(text).to.equal(`${i+1}(current)`);
                } else {
                    expect(text).to.equal(`${i+1}`);
                }
            });
        };

        // ✅ Verify page 2 is actually different content
        for (let i=0; i<max_per_page-1; i++){     // A little bit overkill but no major cost to perf.
            cy.get(selectors['search_result']).eq(i)
            .find("div.card-title")
            .invoke("text")
            .then((text) => {
                expect(touch_points[i]).not.to.equal(text);
            });
        };
    })

    /*-- Verify UTF-8 chars can be searched ------------------------------------------------------------------------
    ✅ Searching for a UTF-8 char title yields it's English name
    -------------------------------------------------------------------------------------------------------------------*/
    it("UTF-8 Movie title", () => {
        let search_term = "臥虎藏龍";  // Chinese name for Crouching Tiger Hidden Dragon 
        let expect_title = "Crouching Tiger, Hidden Dragon"

        // Search for movie term and get a result
        cy.get(selectors["input"]).type(`${search_term}{enter}`, { delay: 300 });

        // ✅ The expected English movie title shows
        cy.contains(expect_title);
    })
});

/*-- Share feature -------------------------------------------------------------------------------
✅ The URL shared is consistent with the search
--------------------------------------------------------------------------------------------------------------------*/
describe('Share', { tags: ['regression', "share"] }, () => {
    beforeEach(() => {
        cy.visit('/');  // Base URL. Configure in cypress.config.ts
    });

    /*-- Verify the url is direct to results --------------------------------------------------------------------------
    ✅ Do a search and very the url can be shared to the same search results when hit.
    -----------------------------------------------------------------------------------------------------------------*/
    it('Get search url and verify url retains results', { tags: ['smoke'] }, () => {
        let search_term = "of";  // A word that must exist in more than x movies
        let max_per_page = 20;

        // Search for movie term and get a result
        // Type search term, with delay to simulate more human-like
        cy.get(selectors["input"]).type(`${search_term}{enter}`, { delay: 300 });

        // Save a few current results to verify page has turned later
        let touch_points = []                  // Where to save the titles of this page
        for (let i=0; i<max_per_page-1; i++){  // Get the titles
            cy.get(selectors['search_result']).eq(i)
            .find("div.card-title")
            .invoke("text")
            .then((text) => {
                touch_points.push(text);
            });
        };

        // Get current url
        cy.url().then((shareURL) => {
            // Go to main page again to remove clear the search result.
            cy.visit("/"); 
            
            // Go to the search url
            cy.visit(shareURL);

            // ✅ Verify the page actually contains the same movies
            for (let i=0; i<max_per_page-1; i++){
                cy.get(selectors['search_result']).eq(i)
                .find("div.card-title")
                .invoke("text")
                .then((text) => {
                    expect(touch_points[i]).to.equal(text);
                });
            };
        });
    });
});
