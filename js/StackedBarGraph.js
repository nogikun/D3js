// --------------------
//  functions
// --------------------
function createStackedBarGraph(selector, data, areaWidth, areaHeight, margin, width, height, outerRadius , barGap) {
    const svg = d3.select(selector)
        .attr("width", areaWidth)
        .attr("height", areaHeight)
        .attr(
            "viewBox",
            [-width / 2, -height / 2, width, height] // 第1,2引数: x, y座標の原点, 第3,4引数: 幅, 高さ
        )
        .append("g") // グループを追加
        .attr("transform", `translate(${margin.left}, ${margin.top})`); // グループを移動（？）
    
    // データ
    const groups = data.map(d => d.columns.slice(3)); // グループ名を取得 (areaA, areaB, areaC)
    const keys = groups[0]; // キーを取得 (areaA, areaB, areaC) ?
    const xColumns = data.map(d => d.columns[0] + d.columns[1] + " ~ " + d.columns[2]); // キーを取得 ("2020-01-01 0:00:00 ~ 1:00:00", ...)
    
    // スケール
    const xScale = d3.scaleBand() // Band = 離散的
        .domain(xColumns)
        .range([0, width]) // 棒グラフの幅
        .padding(barGap); // 棒グラフの間隔
    
    const yScale = d3.scaleLinear() // Linear = 連続的
        .domain([0, d3.max(data, d => d3.sum(keys, key => d[key]))]).nice()
        .range([height, 0]);
    
    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeCategory10);
    
    // グラフの描画
    
}

// --------------------
//  init
// --------------------

// データ（テスト用）
const data = [
    {date : "2020-01-01", startTime : "0:00:00", endTime : "1:00:00", areaA : 10, areaB : 20, areaC : 30},
    {date : "2020-01-01", startTime : "1:00:00", endTime : "2:00:00", areaA : 20, areaB : 30, areaC : 40},
    {date : "2020-01-01", startTime : "2:00:00", endTime : "3:00:00", areaA : 30, areaB : 40, areaC : 50},
    {date : "2020-01-02", startTime : "0:00:00", endTime : "1:00:00", areaA : 40, areaB : 50, areaC : 60},
    {date : "2020-01-02", startTime : "1:00:00", endTime : "2:00:00", areaA : 50, areaB : 60, areaC : 70},
];

//　エリアの設定
const areaWidth = 500;
const areaHeight = 500;
const margin = {top: 20, right: 20, bottom: 40, left: 40};

// グラフの設定
const width = areaWidth - margin.left - margin.right; //　左右のマージンを引く
const height = areaHeight - margin.top - margin.bottom; // 上下のマージンを引く
const outerRadius = Math.min(width, height) / 2 - 10; // 半径
const barGap = 0.3; // 棒グラフの間隔

// グラフの描画
createStackedBarGraph("#stackedBarGraph",
    data, areaWidth, areaHeight, margin, width, height, outerRadius , barGap);