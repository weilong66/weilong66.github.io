class e extends HTMLElement{constructor(){super()}connectedCallback(){this.scores=JSON.parse(localStorage.getItem("scores")),this.render()}getScores(){const e=String.raw;let t="";for(let r of this.scores)t+=e`
        <tr>
          <td>${r.player1.name}(${r.player1.score})</td>
          <td>${r.player2.name}(${r.player2.score})</td>
          <td>${r.board}</td>
        </tr>
      `;return t}render(){const e=String.raw;this.innerHTML=e`
      <section>
        <h1>Best Scores</h1>
        <table>
          <tr>
            <th>Player 1</th>
            <th>Player 2</th>
            <th>Board</th>
          </tr>
          ${this.getScores()}
      </section>
    `}}customElements.define("game-scores",e);
//# sourceMappingURL=index.ba6fa05f.js.map
