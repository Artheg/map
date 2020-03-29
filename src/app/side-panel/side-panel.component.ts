import { Component, OnInit } from "@angular/core";
import { DrawService } from "../services/draw.service";

@Component({
  selector: "app-side-panel",
  templateUrl: "./side-panel.component.html",
  styleUrls: ["./side-panel.component.scss"]
})
export class SidePanelComponent implements OnInit {
  constructor(private drawService: DrawService) {
  }

  ngOnInit() {}

  onDrawClick = () => {
    this.drawService.onDrawClick();
  }
}
