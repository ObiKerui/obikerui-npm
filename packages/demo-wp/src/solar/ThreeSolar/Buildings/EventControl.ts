/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import { Vector3 } from 'three';
import { USER_EVENT } from '../Lib/sharedTypes';
import { BuildingModel, InteractionMode, Model } from '../Model/Model';
import { IEventMgr } from '../Lib/Structure';

import PositionControl from '../Controllers/PositionControl';
import RotateControl from '../Controllers/RotateControl';
import ScaleControl from '../Controllers/ScaleControl';
import RoofControl from '../Controllers/RoofControl';
import {
  ElevationControl,
  IGeometryControl,
} from '../Controllers/ElevationControl';

class GeometryControl implements IGeometryControl {
  buildingModel: BuildingModel;
  elevVectorsOnStart: Vector3[];
  vectorsOnStart: Vector3[];
  perspVectorsOnStart: Vector3[];

  constructor(building: BuildingModel) {
    this.buildingModel = building;
    this.elevVectorsOnStart = [];
    this.vectorsOnStart = [];
    this.perspVectorsOnStart = [];
  }

  onMouseDown(): void {
    const elevVecs = this.buildingModel.buildingElev.getRoofGeometry();
    this.elevVectorsOnStart = elevVecs.map((vec) => vec.clone());

    const vecs = this.buildingModel.buildingPlan.getRoofGeometry();
    this.vectorsOnStart = vecs.map((vec) => vec.clone());

    const persVecs = this.buildingModel.buildingPersp.getRoofGeometry();
    this.perspVectorsOnStart = persVecs.map((vec) => vec.clone());
  }

  getEavesHeightFromGround(): number {
    const { geometryModifier } = this.buildingModel;
    const heightFromGround = geometryModifier.getEavesHeightFromGround(
      this.elevVectorsOnStart
    );
    return heightFromGround;
  }

  getRoofHeightFromGround(): number {
    const { geometryModifier } = this.buildingModel;
    const heightFromGround = geometryModifier.getRoofHeightFromGround(
      this.elevVectorsOnStart
    );
    return heightFromGround;
  }

  getRoofHeightFromEaves(): number {
    const { geometryModifier } = this.buildingModel;
    const heightFromGround = geometryModifier.getRoofHeightFromEaves(
      this.elevVectorsOnStart
    );
    return heightFromGround;
  }

  setRoofHeightFromGround(newRoofHeight: number): void {
    const { geometryModifier, Elevation, Persp } = this.buildingModel;

    const newVectors = geometryModifier.setRoofHeightFromGround(
      this.elevVectorsOnStart,
      newRoofHeight
    );
    Elevation.setRoofGeometry(newVectors);
    Persp.setRoofGeometry(newVectors);
  }

  setRoofHeightFromEaves(newRoofHeight: number): void {
    console.log('new roof height: ', newRoofHeight);
    throw new Error('Method not implemented.');
  }

  setEavesHeightFromGround(newEavesHeight: number): void {
    const { geometryModifier, Elevation, Persp } = this.buildingModel;

    const newVectors = geometryModifier.setEavesHeightFromGround(
      this.elevVectorsOnStart,
      newEavesHeight
    );
    Elevation.setRoofGeometry(newVectors);
    Persp.setRoofGeometry(newVectors);
  }
}

class BuildingEventControl implements IEventMgr {
  position: PositionControl;
  rotate: RotateControl;
  scaler: ScaleControl;
  roof: RoofControl;
  elevation: ElevationControl;
  buildingModel: BuildingModel;

  constructor(building: BuildingModel) {
    this.buildingModel = building;
    this.position = new PositionControl();
    this.rotate = new RotateControl();
    this.scaler = new ScaleControl();
    this.roof = new RoofControl();

    const geometryControl = new GeometryControl(this.buildingModel);
    this.elevation = new ElevationControl();
    this.elevation.GeometryControl = geometryControl;
  }

  updateElevationSceneObject(model: Model) {
    const { elevationScene, SelectedStructure } = model;
    if (!elevationScene || !SelectedStructure) {
      throw new Error('Error - no elevation scene');
    }

    // remove all from elevation scene and add this if its a building?
    const { children } = elevationScene.scene;
    children.forEach((child) => {
      child.removeFromParent();
    });
    elevationScene.scene.add(SelectedStructure.Elevation.Base.transform);
  }

  onChangePosition(mouseEvent: USER_EVENT, model: Model) {
    this.position.onUpdate(mouseEvent, model);
  }

  onChangeElevations(mouseEvent: USER_EVENT, model: Model) {
    this.elevation.onUpdate(mouseEvent, model);
  }

  onUpdate(mouseEvent: USER_EVENT, model: Model) {
    switch (model.interaction) {
      case InteractionMode.POSITION:
        this.updateElevationSceneObject(model);
        this.onChangePosition(mouseEvent, model);
        break;
      case InteractionMode.ROTATE:
        this.rotate.onUpdate(mouseEvent, model);
        break;
      case InteractionMode.SCALE:
        this.scaler.onUpdate(mouseEvent, model);
        break;
      case InteractionMode.ADJUST_ROOF:
        this.roof.onUpdate(mouseEvent, model);
        break;
      case InteractionMode.ADJUST_ELEVATION:
        this.onChangeElevations(mouseEvent, model);
        break;
      default:
        break;
    }
  }
}

export default BuildingEventControl;
