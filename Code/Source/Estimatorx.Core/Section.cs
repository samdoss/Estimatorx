using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace Estimatorx.Core
{
    /// <summary>
    /// A group of estimates for a section of the application being estimated.
    /// </summary>
    public class Section
    {
        public Section()
        {
            Tasks = new List<Task>();
        }

        /// <summary>
        /// Gets or sets the identifier for the model.
        /// </summary>
        /// <value>
        /// The identifier for the model.
        /// </value>
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets the name of the section.
        /// </summary>
        /// <value>
        /// The name of the section.
        /// </value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the total number of tasks for this section.
        /// </summary>
        /// <value>
        /// The total number of tasks for this section.
        /// </value>
        [DefaultValue(0)]
        public int TotalTasks { get; set; }

        /// <summary>
        /// Gets or sets the total number hours for this section.
        /// </summary>
        /// <value>
        /// The total number hours for this section.
        /// </value>
        [DefaultValue(0)]
        public int TotalHours { get; set; }

        /// <summary>
        /// Gets or sets the total number of weeks for this section based on the number of hours per week for the project.
        /// </summary>
        /// <value>
        /// The total number of weeks for this section based on the number of hours per week for the project.
        /// </value>
        /// <seealso cref="P:Project.HoursPerWeek"/>
        [DefaultValue(0)]
        public double TotalWeeks { get; set; }


        /// <summary>
        /// Gets or sets the estimates for this section.
        /// </summary>
        /// <value>
        /// The estimates for this section.
        /// </value>
        public List<Task> Tasks { get; set; }
    }
}