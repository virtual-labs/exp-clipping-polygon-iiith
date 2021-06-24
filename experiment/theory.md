**Sutherland Hodgeman's Polygon Clipping Algorithm**

Pseudo Code of the algorithm

Input : Vertices of the polygon, (xi, yi) ∀i= {1, 2, ..., n} for n vertices in the polygon and the coordinates of the opposite corners of the clipped window.
Steps of the Algorithm

    for each of the four boundaries of the clipped window

	  for each edge eiin the polygon

		Pi = (xi, yi) & Pi+1 = (xi+1, yi+1) represent the two vertices of edge ei.

		if Pi & Pi+1 both lie outside the clipping area

			then no point is written

		else if Pi & Pi+1 both lie inside the clipping area

			then Pi is written into the points of clipped polygon

		else if Pi is inside and Pi+1 is outside

			then Pi is written into the points of clipped polygon and we calculate the intersection of ei with the concerned boundary and the point of intersection is written into the points of clipped polygon.

		else

			then Pi+1 is written into the points of clipped polygon and we calculate the intersection of ei with the concerned boundary and the point of intersection is written into the points of clipped polygon.



