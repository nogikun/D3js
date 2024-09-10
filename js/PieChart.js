// --------------------
//  functions 
// --------------------
function createPieChart(selector, data, width, height, outerRadius, color) {
    // const data = [
    //     {label: '車両相互', value: 80},
    //     {label: '人対車両', value: 20},
    //     {label: '車両単独', value: 30},
    // ];

    const svg = d3.select(selector)
        .attr("width", width)
        .attr("height", height)
        .attr(
            "viewBox",
            [-width / 2, -height / 2, width, height] // 第1,2引数: x, y座標の原点, 第3,4引数: 幅, 高さ
        );

    const arc = d3.arc()
        .innerRadius(100)
        .outerRadius(outerRadius);

    // const pie = d3.pie().sort(null).value( // ソートしない
    const pie = d3.pie().value( // ソートする
        function(d) {
            return d.value;
        }
    );
    
    const path = svg.datum(data).selectAll("path")
        .data(pie)
        .join("path")
        .attr("fill", (d, i) => color(i))
        .attr("id", (d, i) => `${d.data.label}`) // idを付与：ユニークなラベル名が入る
        .attr("class", "button")
        .attr("d", arc)
        .each(function(d) {
            this._current = d; // 初期角度を保存
        });
    
    // ラベル
    const arcs = pie(data);
    svg.selectAll("text")
        .data(arcs)
        .enter().append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)  // セグメントの中心にラベルを配置
        .attr("text-anchor", "middle")  // ラベルを中央に揃える
        .attr("font-size", "15px")
        .attr("font-weight", "bold")
        .attr("fill", "white")
        .text(d => d.data.label)  // ラベルを表示
    
    svg.append("text")
        .attr('x', 0)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('font-size', '20px')
        .attr('font-weight', 'bold')
        .attr('fill', 'black')
        .selectAll('tspan')
        .data(['事故の割合', '総数'
            + data.reduce((a, b) => a + b.value, 0) // 総数を計算
            + '件'])
        .enter().append('tspan')
        .attr('x', 0)
        .attr("dy", (d, i) => `${i * 1.2}em`)  // 各行の縦の位置
        .text(d => d);
}

// --------------------
//  init
// --------------------

// グラフの設定
const width = 500;
const height = 500;
const outerRadius = Math.min(width, height) / 2 - 10; // 半径
const color = d3.scaleOrdinal(d3.schemeCategory10);

// Papa Parse で CSV ファイルを読み込む
$.ajax({
    url: './data/data.csv',
    type: 'GET'
}).done('data', function(data) {
    console.log(data); // 文字列
    const parsed = Papa.parse(data, {
        header: true,
        dynamicTyping: true // 数値として解析
    });
    console.log(parsed.data); // json形式
    const pieChart = createPieChart('#PieChart', parsed.data, width, height, outerRadius, color);
});


// --------------------
//  Events
// --------------------

// 複数のセレクタにマッチする全ての要素を取得
const listeners = document.querySelector('.button');

// クリックイベントを追加
listeners.forEach(listener => {
    listener.addEventListener('click', function() {
        const id = this.id;
        console.log(id);
    });
});
