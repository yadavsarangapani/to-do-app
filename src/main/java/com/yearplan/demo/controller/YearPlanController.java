package com.yearplan.demo.controller;

import com.yearplan.demo.entity.YearPlan;
import com.yearplan.demo.repository.YearPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/yearplan")
@CrossOrigin(origins = "http://localhost:3000")
public class YearPlanController {

    @Autowired
    private YearPlanRepository repository;

    // Get all tasks
    @GetMapping
    public List<YearPlan> getAllTasks() {
        return repository.findAll();
    }

    // Get task by id
    @GetMapping("/{id}")
    public YearPlan getTaskById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    // Create a new task
    @PostMapping
    public YearPlan createTask(@RequestBody YearPlan plan) {
        return repository.save(plan);
    }

    // Update an existing task
    @PutMapping("/{id}")
    public YearPlan updateTask(@PathVariable Long id, @RequestBody YearPlan updatedPlan) {
        return repository.findById(id).map(task -> {
            task.setText(updatedPlan.getText());
            task.setStatus(updatedPlan.getStatus());
            return repository.save(task);
        }).orElse(null);
    }

    // Delete a task
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
