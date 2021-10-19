import { Grid, UserConfig, h, Row } from "gridjs";
import { TCell } from "gridjs/dist/src/types";
import { VNode } from "preact";

export class RoomGrid {
  region: string;
  grid: Grid;
  constructor(container: HTMLElement, region: string, numberOfRooms: number) {
    this.region = region;
    const userConfig: UserConfig = {
      columns: [
        {
          name: "Room",
          width: "10%"
        },
        {
          name:"Player A",
          width: "45%",
          formatter: this.format
        },
        {
          name:"Player B",
          width: "45%",
          formatter: this.format
        }
      ],
      data: Array(numberOfRooms).fill(null).map((_, index) => [
        index, null, null
      ])
    };
    this.grid = new Grid(userConfig);
    this.grid.render(container);
  }

  private format(cell: TCell, row: Row): VNode {
    if (cell === null) { 
      return h('button', {
        onClick: () => alert(`Editing ${row.cell(0).data}st row. Data: `)
        }, 'Enter');
    } else {
      return h('span', null, `Somebody ${row.cell(0)}`)
    }
  }
}