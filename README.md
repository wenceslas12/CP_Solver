# Running the Application

## Requirements

To run the application, you need to have Node.js installed. This software can be downloaded from the official website: Node.js.

## Installation Check

To verify the correct installation, open the command line and enter:  `npm -v`. This command will display the version of the installed software, confirming the correct installation.

## Launching the Application

1.  Unzip the zipped file with the application.
2.  Switch to the application folder in the command line:  `cd path/to/folder`.
3.  Install the necessary modules:  `npm install`.
4.  Run the application:  `npm run dev`. This command will start the application and display a link, click on it to open the application in the default browser.

To restart the application, just perform steps 2 and 4.

## Stopping the Application

To stop the application, press the  `Ctrl + C`  key combination in the command line.

# Application Control

## Navigation in the Application

After launching the application, the home screen with information is displayed. To create a graph, click on the CPM or PERT button in the upper right corner. This opens the graph editor. You switch between methods using the submenu within each method.

## Creating a Graph Using the Editor

1.  Adding a node: Click on the button in the lower left corner of the graph editor.
2.  Moving a node: Select a node and move it using the mouse and the left button pressed.
3.  Selected node: After selecting a node, two buttons appear:
    -   Cross on the left: Used to remove the node (and all its edges).
    -   Arrow on the right: Used to create an edge.

To create an edge, select the source node, click on the arrow button, and then select the target node. The edge can only be connected to nodes with a higher number. To cancel the action, press ESC. Then a form for setting activity values appears.

## Setting Graph Styles

To set the size of the node, numbers, or line width, click on the menu at the bottom right and select Settings. Here you can adjust various display values.

## Creating a Graph Using a Matrix

On the Matrix tab, you can enter a graph using an adjacency matrix. There are buttons available: * Increase row: Adding a row. * Decrease row: Removing a row. * Placement node: Placing nodes in the graph.

To add an edge, click on the corresponding box in the matrix.

## Running Individual Methods

If the graph meets the requirements of a network graph, methods can be performed. Click on the button at the bottom left with the name of the method, which opens the control panel: * Middle button: Performs the entire method. * Right button: Performs one step of the method. * Left button: Goes back one step.

## Backup

To save the graph, open the menu in the lower right corner and click on Export data. The graph is saved as a JSON file. To load a graph, select Import data and choose the appropriate file.

## Additional Features

* Downloading the graph as PNG: In the menu, click on Download PNG.
* Downloading the Gantt chart in PNG: The button is located on the Gantt chart tab in the upper right corner.
* Downloading the table as PDF: The button is in the upper left corner on the table tab.



# Drawing in the Graph Editor

To draw with the mouse, activate the Drawing mode in the drop-down menu. At the bottom left, you can choose a color and activate the eraser. To return to the graph creation mode, turn off the Drawing mode in the drop-down menu
