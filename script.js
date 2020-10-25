//onload event runs when the webpage loads. The html body section will run.
onload = function () {

    //assign the html tag information in the variables

    const container = document.getElementById('container');
    const container2 = document.getElementById('container2');
    const genNew = document.getElementById('generate-graph');
    const out1 = document.getElementById('out-1');
    const out2 = document.getElementById('out-2');
    const out3 = document.getElementById('out-3');

    //vis js library provides the interactive graph. so we set some options for the graph
    //design and visibility.

    const options = {
        edges: {
            arrows: {
                to: true
            },
            labelHighlightBold: true,
            font: {
                size: 20
            }
        },
        nodes: {
            font: '12px arial red',
            scaling: {
                label: true
            },
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf015',
                size: 40,
                color: "black"
            }
        }
    }

    //container and container2 are the two containers in the html page.
    //container stores the initial generated graph.
    //and container2 stores the one of the three output graphs at any given time.
    //So we create a new Network which is in the vis library, and set the options that 
    //we created at line 16.

    const network = new vis.Network(container);
    const network2 = new vis.Network(container2);
    network.setOptions(options);
    network2.setOptions(options);


    //This function is responsible for creating a new graph, when  we click on generate graph button.

    function createData() {

        //There are 4 inputs in html page. we get all the input values and assign them.
        var x = document.getElementById("frm1");
        let conn = x.elements[0].value;
        let V = parseInt(document.getElementById("nodenum").value)
        starting_node = parseInt(document.getElementById("startingnode").value)
        ending_node = parseInt(document.getElementById("endingnode").value)
        var splitconn = conn.split("\n")

        //now we are creating the vertices for the graph, that will be later passed to the network.
        let vertices = []
        for (let i = 1; i < V + 1; i++) {

            // we will include all the nodes from 1 to V, but we make the source node as red color
            // and destination as green color. So we use if condition to check if it is source/
            // destionation or just a common node. the id and label constitute the name of the vertices.
            if (i != starting_node && i != ending_node) {
                vertices.push({
                    id: i,
                    label: "person " + (i),

                })
            } else if (i == starting_node) {
                vertices.push({
                    id: i,
                    label: "person " + (i),
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf015',
                        size: 40,
                        color: "red"
                    }
                })
            } else if (i == ending_node) {
                vertices.push({
                    id: i,
                    label: "person " + (i),
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf015',
                        size: 40,
                        color: "green"
                    }
                })
            }
        }

        // As the vertices are ready, we are going to link them using edges.
        let edges = []
        i = ""
        //splitconn is the input we got from the user as a comma separated value.
        // we split the values so splitvalues[0] is starting node, splitvalues[1] is the ending node.
        //splitvalues[2] is the cost between the two nodes.
        //so from starting node, to ending node, label is the cost, and we should parse it as a string.
        for (i in splitconn) {
            let splitvalues = splitconn[i].split(",")
            edges.push({
                from: splitvalues[0],
                to: splitvalues[1],
                color: 'green',
                label: String(splitvalues[2])
            })
        }
        //we pass them as an object of associative array, and return it.
        //the calling function assigns these values to the network on click.
        const data = {
            nodes: vertices,
            edges: edges
        }
        return data;
    }

    //This is a function that will be used in dijkstra algorithm, to find the node with the least cost.
    // processed list keeps track of all the nodes that has been visited.
    function find_lowest_cost_node(costs) {

        let lowest_cost = Infinity
        let lowest_cost_node = null

        for (var node in costs) {
            cost = costs[node]
            if (((cost) < (lowest_cost)) && !(processed.includes(node))) {
                lowest_cost = parseInt(cost)
                lowest_cost_node = node
            }
        }
        return lowest_cost_node;
    }


    //DIJKSTRA ALGORITHM SOLUTION:
    function solveData() {
        //we get the information from the input
        vertices = []
        edges = []
        var x = document.getElementById("frm1");
        V = parseInt(document.getElementById("nodenum").value)
        let conn = x.elements[0].value;
        var splitconn = conn.split("\n")

        //We create a graph, which is an associative array, it will contain nested associative array.
        //Example: node1 : {node2:3, node3:10}. This means node1 has two neighbors - node2 and node3
        //the cost from node1 to node2 is 3, the cost from node1 to node3 is 10.
        // We are going to store the link to the graph in this format.
        graph = {}
        for (let i = 1; i <= V; i++) {
            graph[i] = {}
            if (i != starting_node && i != ending_node)
                vertices.push({
                    id: i,
                    label: "person " + (i),
                })
            if (i == starting_node)
                vertices.push({
                    id: i,
                    label: "person " + (i),
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf015',
                        size: 40,
                        color: "red"
                    }
                })
            if (i == ending_node)
                vertices.push({
                    id: i,
                    label: "person " + (i),
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf015',
                        size: 40,
                        color: "green"
                    }
                })
        }
        V = Math.round(V) + 1
        let l = [];
        for (let i = 1; i <= V; i++) {
            l.push(i);
        }

        //neighbor_start will contain the neighbor of the graph's starting node which is received as input.
        //costs will keep track of all the costs from starting_node which is the source node, to every other nodes
        //At the same time we keep track of the nodes parent in the parents variable.
        //processed contains all the nodes, that has been previously visited.
        let neighbor_start = []
        costs = {}
        parents = {}
        processed = []
        let i = ""

        //This for loop iterates over the links given as the input, and assign  it to graph, parents and cost
        for (i in splitconn) {
            let splitvalues = splitconn[i].split(",")
            let start = parseInt(splitvalues[0])
            let end = parseInt(splitvalues[1])

            let cost_edge = parseInt(splitvalues[2])
            if (!Number.isNaN(start)) {
                graph[start][end] = parseInt(cost_edge)
                if (start == starting_node) {
                    neighbor_start.push(end)
                    costs[end] = parseInt(cost_edge)
                    parents[end] = starting_node
                }
            }
        }
        const l_set = [...new Set(l)];
        const neighbor_start_set = [...new Set(neighbor_start)];
        let difference = new Set([...l_set].filter(x => !neighbor_start_set.includes(x)));

        difference = Array.from(difference);

        //the difference array is used to loop throught the elements that are not connected to 
        // starting node, to keep their cost at infinity at the beginning, later we try to reduce 
        // this cost.
        for (var k in difference) {

            if (parseInt(difference[k]) != starting_node) {

                costs[difference[k]] = Infinity
                parents[difference[k]] = null;
            }
        }
        //since dijkstra is a greedy algorithm, we always tend to find the lowest cost node and keep it as
        // the current node.
        let node = find_lowest_cost_node(costs)

        //Here we check a node, and loop through its neighbors to see, if the cost from the
        //current node to its neighbors can be reduced if possible. If the new cost is less than
        //the old cost, we change it. The new cost is the current node cost plus the edge connecting to the
        //neighbor node.
        while (node != null) {
            cost = costs[node]
            neighbors = graph[node]
            for (var n in neighbors) {
                new_cost = (cost) + (neighbors[n])
                new_cost = (new_cost)
                if ((costs[n]) > (new_cost)) {
                    costs[n] = new_cost
                    parents[n] = parseInt(node)
                }
            }
            processed.push(node)
            node = find_lowest_cost_node(costs)
        }
    }

    //BELLMAN-FORD ALGORITHM.
    //This algorithm will find every possible path, to get the minimum path as possible, for negative
    //weights as well.

    function solveData2() {

        //We start with the same process of creating graph, and assigning parents and costs like 
        //dijkstra
        vertices = []
        edges = []
        var x = document.getElementById("frm1");
        V = parseInt(document.getElementById("nodenum").value)
        let conn = x.elements[0].value;
        var splitconn = conn.split("\n")
        graph = {}
        for (let i = 1; i <= V; i++) {
            graph[i] = {}
            if (i != starting_node && i != ending_node)
                vertices.push({
                    id: i,
                    label: "person " + (i),
                })
            if (i == starting_node)
                vertices.push({
                    id: i,
                    label: "person " + (i),
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf015',
                        size: 40,
                        color: "red"
                    }
                })
            if (i == ending_node)
                vertices.push({
                    id: i,
                    label: "person " + (i),
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf015',
                        size: 40,
                        color: "green"
                    }
                })
        }
        V = Math.round(V) + 1
        // let l = [...Array(V).keys()];
        // l.splice(0, 1)

        let l = [];

        for (let i = 1; i <= V; i++) {
            l.push(i);
        }
        let neighbor_start = []
        costs = {}
        parents = {}
        processed = []
        let i = ""
        for (i in splitconn) {
            let splitvalues = splitconn[i].split(",")
            let start = parseInt(splitvalues[0])
            let end = parseInt(splitvalues[1])

            let cost_edge = parseInt(splitvalues[2])
            if (!Number.isNaN(start)) {
                graph[start][end] = parseInt(cost_edge)
                if (start == starting_node) {
                    neighbor_start.push(end)
                    costs[end] = parseInt(cost_edge)
                    parents[end] = starting_node
                }
            }
        }
        //Here we assign every node except starting node costs as infinity, and then we try to 
        //relax this costs later, but using brute force and dynammic programming to optimise them.
        costs[starting_node] = 0
        for (let i in l) {
            if (i != starting_node) {
                costs[i] = Infinity
                parents[i] = null;
            }
        }
        console.log(costs)

        //In this nested for loops, outer for loop runs for n number of times, where n is the total number of nodes.
        //The inner for loops runs as for every edge in the graph. So at every iteration, 
        //the least cost is being tracked, and it will be updated at every edges as the iteration goes.
        //for every keyvalue pair in the graph, and for every key value pair that is inside the key of graph,
        //we try to find minimum costs by checking the condition, and update the costs, and also the 
        //parent at which the cost is found to be minimum.
        for (let i = 0; i < V; i++) {
            for ([k, v] of Object.entries(graph)) {
                k = parseInt(k)
                k1 = parseInt(k)
                for ([k1, v1] of Object.entries(graph[k])) {
                    if (costs[k1] > costs[k] + graph[k][k1]) {
                        costs[k1] = costs[k] + graph[k][k1]
                        parents[k1] = k
                        console.log(k, k1, costs)
                    }
                }
            }
        }
        delete costs[starting_node]
        console.log(costs)

    }
    //The decider function calls the appropriate dijkstra or bellman ford algorithm based on selected option
    function decider() {
        let e = document.getElementById("items");
        let algo_val = e.options[e.selectedIndex].value;

        if (algo_val == "dj") {
            solveData()

        } else if (algo_val == "bell") {
            solveData2()
        }
    }

    //This function is used to show the cost progression from the source node to the destination node.
    //This is the most commonly used output.
    function output1() {
        //The decider function picks whether to run dijkstra or bellmanford, based on user input.
        //We just push edges and vertices appropriately in this function.
        decider()
        let temp = []
        for (let i = 1; i < V + 1; i++) {
            if (parents[i] == null && i != starting_node) {
                temp.push(i)
            }
            edges.push({
                from: parents[i],
                to: i,
                color: 'green',
                label: String(costs[i])
            })
        }

        let l = [...Array(V).keys()];
        delete l[0]
        for (let i = 1; i < V + 1; i++) {
            edges.push({
                from: starting_node,
                to: temp[i - 1],
                color: 'green',
                label: String(Infinity)
            })

        }
        const data = {
            nodes: vertices,
            edges: edges
        }
        return data;
    }

    //Output2 is for convenient display of total distance from source to every other node, not only
    //destination node.
    function output2() {
        decider()
        for (var n in costs) {
            edges.push({
                from: starting_node,
                to: n,
                color: 'green',
                label: String(costs[n])
            })
        }
        const data = {
            nodes: vertices,
            edges: edges
        }
        return data;
    }



    //output3 is used to display the path which leads to the destination from source.
    //it just highlights the portion of input graph, which is the ideal path.
    function output3() {
        decider()
        end = ending_node

        let remaining = []

        //In this loop the appropriate vertices and edges are pushed, to make the output functional.
        //In order to keep track of the original graph, we use the parents and iterate through them
        //in a way that it iteratively tracks the parent of a node, and then tracks the parent of the parent node
        //so on until the starting node is reached.
        for (var n in costs) {
            if (end != starting_node && (end in parents)) {


                try {
                    edges.push({
                        from: parents[end],
                        to: end,
                        color: 'green',
                        label: String(graph[parents[end]][end])
                    })
                } catch (err) {

                    edges.push({
                        from: starting_node,
                        to: end,
                        label: String(Infinity)
                    })

                    vertices = []
                    vertices.push({
                        id: starting_node,
                        label: "person " + (starting_node),
                        icon: {
                            face: 'FontAwesome',
                            code: '\uf015',
                            size: 40,
                            color: "red"
                        }
                    })
                    vertices.push({
                        id: end,
                        label: "person " + (end),
                        icon: {
                            face: 'FontAwesome',
                            code: '\uf015',
                            size: 40,
                            color: "green"
                        }
                    })
                    const data = {
                        nodes: vertices,
                        edges: edges
                    }
                    return data;
                }
                remaining.push(end)
                end = parents[end]
                prev = costs[end]
            }
        }
        remaining.push(end)

        let l = [...Array(V).keys()];
        l.splice(0, 1)
        const l_set = [...new Set(l)];
        const remaining_set = [...new Set(remaining)];
        let remaining_set_now = new Set([...l_set].filter(x => !remaining_set.includes(x)));

        remaining_set_now = Array.from(remaining_set_now);

        let counter = 0
        for (let i in remaining_set_now) {
            vertices.splice(remaining_set_now[i] - counter - 1, 1)

            counter += 1
        }

        const data = {
            nodes: vertices,
            edges: edges
        }
        return data;
    }

    //This is used to call the appropriate functions, and set the network, based on which button
    //the user clicks. 
    //on clicking generate graph button in the webpage, the createdata function is called,
    //and the network is set.
    genNew.onclick = function () {
        //Creating and setting date to network
        let data = createData();
        network.setData(data);
    }

    //likewise for output1 button, output1 function is called
    out1.onclick = function () {
        let data = output1();
        network2.setData(data);
    }
    out2.onclick = function () {

        let data = output2();
        network2.setData(data);
    }
    out3.onclick = function () {
        let data = output3();
        network2.setData(data);
    }

}