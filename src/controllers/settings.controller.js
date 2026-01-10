const dbService = require("../services/db.service");

exports.getSettings = async (req, res) => {
    try {
        const { data, error } = await dbService.supabase
            .from('site_settings')
            .select('*');

        if (error) throw error;

        // Convert array to object
        const settings = data.reduce((acc, curr) => {
            acc[curr.id] = curr.value;
            return acc;
        }, {});

        res.json(settings);
    } catch (error) {
        console.error("Get settings error:", error);
        res.status(500).json({ message: "Failed to fetch settings" });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { id } = req.params;
        const { value } = req.body;

        const { data, error } = await dbService.supabase
            .from('site_settings')
            .upsert({ id, value, updated_at: new Date() })
            .select();

        if (error) throw error;

        res.json({ message: "Settings updated successfully", data });
    } catch (error) {
        console.error("Update settings error:", error);
        res.status(500).json({ message: "Failed to update settings" });
    }
};
