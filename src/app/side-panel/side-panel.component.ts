import { Component, OnInit } from "@angular/core";
import { DataService } from "../services/data.service";

@Component({
  selector: "app-side-panel",
  templateUrl: "./side-panel.component.html",
  styleUrls: ["./side-panel.component.scss"]
})
export class SidePanelComponent implements OnInit {
  constructor(private drawService: DataService) {
  }

  ngOnInit() {}

  onDrawClick = () => {
    this.drawService.onDrawClick();
  }
}
