﻿/// <reference path="../_ref.ts" />

module Estimator {
    "use strict";

    export class EstimateEditController {

        // protect for minification, must match contructor signiture.
        static $inject = [
            '$scope',
            '$location',
            'identityService',
            'modelFactory',
            'projectCalculator',
            'projectRepository'
        ];
        constructor(
            $scope,
            $location: ng.ILocationService,
            identityService: IdentityService,
            modelFactory: ModelFactory,
            projectCalculator: ProjectCalculator,
            projectRepository: ProjectRepository)
        {
            var self = this;

            // assign viewModel to controller
            $scope.viewModel = this;
            self.$scope = $scope;
            self.$location = $location;

            self.identityService = identityService;
            self.modelFactory = modelFactory;
            self.projectCalculator = projectCalculator;
            self.projectRepository = projectRepository
            self.project = <IProject>{};

            // calculate on project change
            $scope.$watch(
                s => angular.toJson(s.viewModel.project),
                _.debounce($.proxy(self.calculate, self), 500));

            //self.load();
        }

        $scope: ng.IScope;
        $location: ng.ILocationService;
        identityService: IdentityService;
        modelFactory: ModelFactory;
        projectCalculator: ProjectCalculator;
        projectRepository: ProjectRepository;
        project: IProject;
        estimateId: string;

        load(id?: string) {
            var self = this;

            self.estimateId = id;

            // get project id
            if (!self.estimateId) {
                self.project = self.modelFactory.createProject();
                return;
            }

            this.projectRepository.find(self.estimateId)
                .success((data, status, headers, config) => {
                    self.project = data;
                })
                .error((data, status, headers, config) => {
                    if (status == 404) {
                        self.project = self.modelFactory.createProject(self.estimateId);
                        return;
                    }
                        
                    // TODO show error
                });
        }

        save() {
            var self = this;

            this.projectRepository.save(this.project)
                .success((data, status, headers, config) => {
                    self.project = data;
                })
                .error((data, status, headers, config) => {
                    // TODO show error
                });
        }

        calculate() {
            console.log("project calculate");

            this.projectCalculator.updateTotals(this.project);
            this.$scope.$apply();
        }


        addAssumption() {
            if (!this.project.Assumptions)
                this.project.Assumptions = [];

            var assumption = this.modelFactory.createAssumption();
            this.project.Assumptions.push(assumption);
        }

        removeAssumption(assumption: IAssumption) {
            if (!assumption)
                return;

            BootstrapDialog.confirm("Are you sure you want to remove this assumption?", (result) => {
                if (!result)
                    return;

                for (var i = 0; i < this.project.Assumptions.length; i++) {
                    if (this.project.Assumptions[i].Id == assumption.Id) {
                        this.project.Assumptions.splice(i, 1);
                        break;
                    }
                }
                this.$scope.$apply();
            });
        }


        addFactor() {
            if (!this.project.Factors)
                this.project.Factors = [];

            var factor = this.modelFactory.createFactor();
            this.project.Factors.push(factor);
        }

        removeFactor(factor: IFactor) {
            if (!factor)
                return;
            BootstrapDialog.confirm("Are you sure you want to remove this assumption?", (result) => {
                if (!result)
                    return;

                for (var i = 0; i < this.project.Factors.length; i++) {
                    if (this.project.Factors[i].Id == factor.Id) {
                        this.project.Factors.splice(i, 1);
                        break;
                    }
                }
                this.$scope.$apply();
            });
        }


        addSection() {
            if (!this.project.Sections)
                this.project.Sections = [];

            var section = this.modelFactory.createSection();
            this.project.Sections.push(section);
        }

        removeSection(section: ISection) {
            if (!section)
                return;

            if (!this.project.Sections)
                return;

            if (section.Estimates && section.Estimates.length) {
                BootstrapDialog.alert("Section not empty. Remove all estimates before removing section.");
                return;
            }


            BootstrapDialog.confirm("Are you sure you want to remove this section?", (result) => {
                if (!result)
                    return;

                for (var i = 0; i < this.project.Sections.length; i++) {
                    if (this.project.Sections[i].Id == section.Id) {
                        this.project.Sections.splice(i, 1);
                        break;
                    }
                }
                this.$scope.$apply();
            });
        }


        addEstimate(section: ISection) {
            if (!section)
                return;

            if (!section.Estimates)
                section.Estimates = [];

            var estimate = <IEstimate>{
                Id: this.identityService.newUUID(),
                Name: 'Task ' + section.Estimates.length,
                IsActive: true
            };

            section.Estimates.push(estimate);
        }

        removeEstimate(section: ISection, estimate: IEstimate) {
            if (!section || !estimate)
                return;

            if (!section.Estimates)
                return;

            BootstrapDialog.confirm("Are you sure you want to remove this estimate?", (result) => {
                if (!result)
                    return;

                for (var i = 0; i < section.Estimates.length; i++) {
                    if (section.Estimates[i].Id == estimate.Id) {
                        section.Estimates.splice(i, 1);
                        break;
                    }
                }
                this.$scope.$apply();
            });
        }
    }

    // register controller
    angular.module(Estimator.applicationName)
        .controller('estimateEditController', [
            '$scope',
            '$location',
            'identityService',
            'modelFactory',
            'projectCalculator',
            'projectRepository',

            EstimateEditController // controller must be last
        ]);

}

