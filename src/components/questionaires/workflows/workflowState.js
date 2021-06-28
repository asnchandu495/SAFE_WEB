import React, { useEffect, useState, Fragment } from "react";
import ReactDOM from "react-dom";
import ReactDragListView from "react-drag-listview/lib/index.js";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import { useParams } from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import workflowService from "../../../services/workflowService";
import ComponentLoadderComponent from "../../common/loadder/componentloadder";
import ToasterMessageComponent from "../../common/toaster";
import Button from "@material-ui/core/Button";
import * as d3 from "d3";

const myTreeData = {
    "name": "Safe to Confirmed",
    "children": [
        {
            "name": "SendEmailActivity",
            "children": [
                { "name": "SendEMailToContacts" },
                { "name": "SendEMailToSelf" },
                { "name": "SendEmailToSecurityManager" },
                { "name": "SendEmailToSiteManager" },
                { "name": "SendEmailToSupervisor" },
                { "name": "SendEmailToSiteBHR" },
            ]
        },
        {
            "name": "SendPushNotification",
            "children": []
        },
        {
            "name": "SendInAppNotification",
            "children": [{ "name": "SendInAppNotificationToSecurityManager" }]
        },
    ]
};

function WorkflowState(props) {
    const groupIdURL = props.match.params.id;
    const workflowIdURL = props.match.params.wid;
    const workflowApiCall = new workflowService();
    const [componentLoadder, setcomponentLoadder] = useState(true);
    const [selectedSurveyQuestions, setSelectedSurveyQuestions] = useState([]);
    const [workflowDetails, setWorkflowDetails] = useState();

    useEffect(() => {
        Promise.all([
            workflowApiCall.getWorkflowActivities(workflowIdURL),
        ])
            .then(([getworkflowDetails]) => {
                let workflowsArray = [];
                getworkflowDetails.selectedWorkflowActivities.map((wf) => {
                    let activitiesOptions = [];
                    wf.options.map((op) => {
                        activitiesOptions.push({ name: op.name })
                    });
                    let activityObject = { name: wf.name, children: activitiesOptions };
                    workflowsArray.push(activityObject);
                });
                let finalObject = { name: `${getworkflowDetails.fromState} to ${getworkflowDetails.toState}`, children: workflowsArray };
                setWorkflowDetails(finalObject);
                loadGraph(finalObject);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    function handleCancel() {
        setTimeout(() => {
            props.history.push(`/questionaires/allquestionaires`);
        }, 1000);
    }

    function loadGraph(finalObject) {
        setcomponentLoadder(false);
        // Code goes here

        var margin = { top: 20, right: 120, bottom: 20, left: 120 },
            width = 1200 - margin.right - margin.left,
            height = 1200 - margin.top - margin.bottom;

        var i = 0,
            duration = 750,
            root;

        var tree = d3.layout.tree()
            .size([height, width]);

        var diagonal = d3.svg.diagonal()
            .projection(function (d) { return [d.y, d.x]; });

        var svg = d3.select("#heap").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        root = finalObject;
        root.x0 = height / 2;
        root.y0 = 0;

        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }

        root.children.forEach(collapse);
        update(root);

        d3.select(window.self.frameElement).style("height", "800px");

        function update(source) {

            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);

            // Normalize for fixed-depth.
            nodes.forEach(function (d) { d.y = d.depth * 180; });

            // Update the nodes…
            var node = svg.selectAll("g.node")
                .data(nodes, function (d) { return d.id || (d.id = ++i); });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                .on("click", click);

            // nodeEnter.append("circle")
            //     .attr("r", 1e-6)
            //     .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
            nodeEnter.append('rect')
                .attr('width', 1e-6)
                .attr('height', 1e-6)
                .style('fill', function (d) { return d._children ? 'lightsteelblue' : '#fff'; });

            nodeEnter.append("text")
                .attr("x", 10)
                .attr("dy", ".35em")
                .text(function (d) { return d.name; })
                .style("fill-opacity", 1e-6);

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

            // nodeUpdate.select("circle")
            //     .attr("r", 4.5)
            //     .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
            let nodeHeight = 40,
                nodeWidth = 150;

            /*function wrap(text, width) {
            text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
              line.push(word);
              tspan.text(line.join(" "));
              if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
              }
            }
            });
            }
            
            nodeHeight = 40, nodeWidth = 150;
            
            nodeUpdate.selectAll("text").call(wrap,nodeWidth);
            
            nodeUpdate.select('rect')
            .attr('rx', 6)
            .attr('ry', 6)
            .attr('y', -(nodeHeight / 2))
            .attr('width', nodeWidth)
            .attr('height', nodeHeight)
            .style('fill', function(d) { return d._children ? 'lightsteelblue' : '#fff'; });  */

            nodeUpdate.select('rect')
                .attr('rx', 6)
                .attr('ry', 6)
                .attr('y', -(nodeHeight / 2))
                .attr('width', function (d) {
                    var textElement = d3.select(this.parentNode).select("text").node();
                    var bbox = textElement.getBBox();
                    var width = bbox.width;
                    return width * 2;
                })
                .attr('height', nodeHeight)
                .style('fill', function (d) { return d._children ? 'lightsteelblue' : '#fff'; });

            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
                .remove();

            // nodeExit.select("circle")
            //     .attr("r", 1e-6);
            nodeExit.select('rect')
                .attr('width', 1e-6)
                .attr('height', 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            // Update the links…
            var link = svg.selectAll("path.link")
                .data(links, function (d) { return d.target.id; });

            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function (d) {
                    var o = { x: source.x0, y: source.y0 };
                    return diagonal({ source: o, target: o });
                });

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function (d) {
                    var o = { x: source.x, y: source.y };
                    return diagonal({ source: o, target: o });
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        // Toggle children on click.
        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }
    }

    return (
        <div className="innerpage-container">
            <Breadcrumbs aria-label="breadcrumb" className="global-breadcrumb">
                <LinkTo
                    color="inherit"
                    href="#"
                    to={`/home/dashboard`}
                    className="inactive"
                >
                    Home
                </LinkTo>
                <LinkTo
                    color="textPrimary"
                    href="#"
                    to={`/questionaires/allquestionaires`}
                    className="inactive"
                >
                    Questionnaire
                </LinkTo>
                <LinkTo
                    color="textPrimary"
                    href="#"
                    to={`/questionaires/assign/`}
                    className="inactive"
                >
                    Assign Questionnaire To User Group
                </LinkTo>
                <LinkTo color="textPrimary" href="#" to={`/questionaires/workflow-states/${groupIdURL}`} className="inactive">
                    Workflow States
                </LinkTo>
                <LinkTo color="textPrimary" href="#" className="active">
                    State Diagram
                </LinkTo>
            </Breadcrumbs>
            <Paper className="main-paper main-paper-add-question">
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={12}>
                        <Paper className="list-questions order-change">
                            {componentLoadder ? (
                                <ComponentLoadderComponent />
                            ) : (<div id="heap"></div>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

export default WorkflowState;
