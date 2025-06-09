**Procedure: Sutherland-Hodgeman Polygon Clipping Experiment**

1. **Set Up Clipping Window:**
   - Enter the coordinates for the clipping window in the input boxes:
     - Top Left: (X, Y) coordinates of the upper-left corner
     - Bottom Right: (X, Y) coordinates of the lower-right corner
   - The clipping window will be displayed as a pink rectangle on the canvas

2. **Configure Polygon:**
   - Enter the coordinates for a 5-point polygon in the input boxes:
     - Each point requires X and Y coordinates
     - Points are connected in order, with the last point connecting back to the first
   - Default values are provided for both the clipping window and polygon
   - Click "Submit" to initialize the simulation

3. **Observe the Clipping Process:**
   - Click "Next" to progress through each step of the algorithm
   - At each step, observe:
     - Yellow dots showing current vertex positions
     - Yellow lines connecting the vertices
     - Vertex coordinates displayed next to each point
     - The "Intermediate Vertices" panel showing the current set of vertices
   
   The clipping process follows this sequence:
   a. Initial polygon vertices (shown in yellow)
   b. After clipping against left edge
   c. After clipping against top edge
   d. After clipping against right edge
   e. After clipping against bottom edge
   f. Final clipped polygon (shown in white)

4. **Understanding the Visualization:**
   - Yellow dots: Current intermediate vertices
   - Yellow lines: Connections between current vertices
   - White lines: Final clipped polygon
   - Pink rectangle: Clipping window
   - Coordinate labels: Show exact position of each vertex
   - Intermediate Vertices panel: Lists all current vertex coordinates

5. **Navigation Controls:**
   - "Next": Move forward to the next clipping step
   - "Prev": Go back to the previous step
   - "Reset": Start over with the same coordinates
   - Each step shows the transformation of vertices as the algorithm progresses

6. **Experiment with Different Configurations:**
   - After completing one experiment, you can:
     - Modify the clipping window coordinates
     - Change the polygon vertices
     - Click "Submit" to start a new experiment
   - Observe how different polygon shapes are clipped against the same window
   - Try polygons that intersect the clipping window in different ways

7. **Key Observations to Make:**
   - How vertices are added or removed during clipping
   - Where new vertices are created at intersection points
   - How the polygon shape changes after each clipping step
   - The relationship between the original polygon and the final clipped result

8. **Tips for Best Results:**
   - Use the "Prev" button to review any step in detail
   - Pay attention to the vertex coordinates in both the canvas and the panel
   - Notice how the algorithm handles vertices that are inside vs. outside the clipping window
   - Observe the creation of new vertices at intersection points

This procedure guides you through the Sutherland-Hodgeman Polygon Clipping Experiment, with a focus on understanding the step-by-step transformation of the polygon through the clipping process. The intermediate vertex visualization helps in understanding how the algorithm works and how the final clipped polygon is constructed.
