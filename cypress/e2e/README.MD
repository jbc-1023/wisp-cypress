<h1>Summary</h1>

<details>
    <summary><b>Genreal ideas</b></summary>
    <ul>
        <li>Tests are written with selectors extracted to have single point of change for convienence.</li>
        <li>CSS alias names are defined in <code>config.env.cssAlias</code> for style testing</li>
        <li>Tests have descriptions.</li>
        <li>Every test start with a known state by going to the main page.</li>
        <li><code>Cypress grep</code> is used for test selection. <a href="https://www.npmjs.com/package/@cypress/grep">Ref</a></li>
        <li>To run all tests, except ones maked as known bugs, <code>npx cypress run --env grepTags=regression+-bug</code></li>
        <li>Thanks for reading! ~Josh</li>
    </ul>
</details>
<details>
    <summary><b>Added tests</b></summary>
    <details>
        <summary><b>Page elements</b></summary>
        <ul>
            <li>Verify title</li>
            <li>Verify input box</li>
            <li>Verify submit button</li>
        </ul>
    </details>
    <details>
        <summary><b>Search</b></summary>
        <ul>
            <li>Verify search can be performed with enter key and click</li>
            <li>Verify suggestions appear when typing</li>
            <li>Verify amount of suggestions</li>
            <li>Verify suggestions can be clicked</li>
            <li>Verify Pagenation</li>
            <li>Verify UTF-8 title</li>
        </ul>
    </details>
</details>
<details>
    <summary><b>Tags definitions</b></summary>
        <details>
            <summary>Types</summary>
                <ul>
                    <li><code>smoke</code> The basic tests that must pass for release</li>
                    <li><code>regression</code> All tests</li>
                    <li><code>error_handling</code> To handle bad inputs</li>
                    <li><code>boundary</code> Tests feature limitations</li>
                    <li><code>bug</code> Currently there's a bug around this</li>
                </ul>
        </details>
        <details>
            <summary>Features</summary>
                <ul>
                    <li><code>search</code> The search feature</li>
                    <li><code>share</code> Shearing the URL</li>
                </ul>
        </details>

</details>
<details>
    <summary><b>🐛Bugs🐛</b></summary>
    <ul>
        <li>FE Search field has no char limit.</li>
        <li>Cannot select suggestions through traditional down arrow key (must use the catch all tab key)</li>
    </ul>
</details>